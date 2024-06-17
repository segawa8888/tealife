'use strict';
const fs = require('fs');
const rimraf = require('rimraf');

const { src, dest, watch, series, parallel, task } = require('gulp');

const ejs = require('gulp-ejs');
const data = require('gulp-data');
const beautify = require('gulp-html-beautify');
const htmlhint = require('gulp-htmlhint');

const sass = require('gulp-sass');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('gulp-autoprefixer');
const mode = require('gulp-mode')({ modes: ['production', 'development'] });


const header = require('gulp-header');
const ignore = require('gulp-ignore');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const browserSync = require('browser-sync');
const convertEncoding = require('gulp-convert-encoding');
const lineEndingCorrector = require('gulp-line-ending-corrector');

const imageMin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");    // 追加
const pngquant = require("imagemin-pngquant");  // 追加
const changed = require("gulp-changed");   

// check os
const os = require('os'),
  Windows = os.type().toString().match('Windows') !== null ? true : false;

// path
const basePath = process.cwd(),
  DEV_PATH = Windows ? basePath + '/src' : './src',
  DIST_PATH = Windows ? basePath + '/dist' : './dist',
  PUB_PATH = Windows ? basePath + '/htdocs' : './htdocs',
  CMN_PATH = Windows ? basePath + '/common' : './common';

let OUTPUT_CASE, OUTPUT_PATH;

// set val
const setDev = (done) => {
  OUTPUT_CASE = 'dev';
  OUTPUT_PATH = DIST_PATH;
  done();
};
const setPub = (done) => {
  OUTPUT_CASE = 'pub';
  OUTPUT_PATH = PUB_PATH;
  done();
};

// clean
const clean = (cb) => {
  rimraf(OUTPUT_PATH, cb);
};

// ejs
const html = () => {
  return src(`${DEV_PATH}/ejs/**/!(_)*.ejs`)
    .pipe(plumber())
    .pipe(
      data((file) => {
        const slash = Windows ? '\\' : '/';
        const PATH = file.path
          .split(Windows ? 'ejs\\' : 'ejs/')[1]
          .replace('.ejs', '.html')
          .replace(/index\.html$/, '');
        const ROOT = `..${slash}`.repeat([PATH.split(slash).length - 1]);
        return {
          PATH,
          ROOT,
        };
      })
    )
    .pipe(
      ejs({
        OUTPUT_CASE: OUTPUT_CASE,
      })
    )
    .pipe(rename({ extname: '.html' }))
    .pipe(
      beautify({
        indent_size: 2,
        max_preserve_newlines: 1,
      })
    )
    .pipe(dest(`${OUTPUT_PATH}`));
};

const validateHTML = () => {
  return src(`${OUTPUT_PATH}/**/*.html`)
    .pipe(
      htmlhint({
        'spec-char-escape': false,
      })
    )
    .pipe(htmlhint.reporter());
};

// css
const css = () => {
  return src(`${DEV_PATH}/scss/**/!(_)*.scss`)
    .pipe(plumber())
    .pipe(sass())
    .pipe(csscomb())
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true,
      })
    )
    .pipe(replace(/@charset (.*?);/g, ''))
    .pipe(header('@charset "UTF-8";\n'))
    .pipe(
      rename((path) => {
        path.dirname += '/naturetealab/assets/css';
      })
    )
    .pipe(dest(`${OUTPUT_PATH}`));
};

// static
const staticFiles = () => {
  return src([`${DEV_PATH}/static/**/*`, `!${DEV_PATH}/static/img/*`])
    .pipe(ignore.include({ isFile: true }))
    .pipe(dest(`${OUTPUT_PATH}/naturetealab/`));
};

// UTF-8 convert
const convertFIles = () => {
  return src([`${OUTPUT_PATH}/**/*.html`, `${OUTPUT_PATH}/**/*.css`, `${OUTPUT_PATH}/**/*.js`])
    .pipe(
      lineEndingCorrector({
        verbose: false,
        eolc: 'CRLF',
      })
    )
    .pipe(convertEncoding({ to: 'UTF-8' }))
    .pipe(dest(`${OUTPUT_PATH}`));
};

const imgMin = (done)=> {
  return src(`${DEV_PATH}/static/img/*`)
    .pipe(changed(`${OUTPUT_PATH}/naturetealab/assets/img`))
    .pipe(
      imageMin([
        pngquant({
          quality: [0.6, 0.7],
          speed: 1,
        }),
        mozjpeg({ quality: 65 }),
        imageMin.svgo(),
        imageMin.optipng(),
        imageMin.gifsicle({ optimizationLevel: 3 }),
      ])
    )
    .pipe(dest(`${OUTPUT_PATH}/naturetealab/assets/img`));
}

// serve
const serve = (done) => {
  browserSync({
    server: {
      baseDir: [CMN_PATH, DIST_PATH],
    },
    port: 3000,
    open: 'external',
    startPath: '/naturetealab/',
  });
  done();
};

// watch
const watchFiles = (done) => {
    watch(`${DEV_PATH}/ejs/**/*.ejs`, series(html, validateHTML, bsReload));
    watch(`${DEV_PATH}/scss/**/*.scss`, series(css, bsReload));
    watch(`${DEV_PATH}/static/img/*`, series(imgMin, bsReload));
    watch(`${DEV_PATH}/static/js/*`, series(staticFiles, bsReload));
    done();
};

const bsReload = (done)=> {
  browserSync.reload();
  done();
};


const buildFIles = series(clean, bsReload,parallel(html, css, staticFiles, imgMin), validateHTML);

exports.build = series(setDev, buildFIles);
exports.dev = series(setDev, buildFIles, serve, watchFiles);
