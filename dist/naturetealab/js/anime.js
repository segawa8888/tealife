/*

  Function

------------------------------ */
var modules = {};

var FadeIn = function (el, options) {
 this.el = el;
 this.init();
 this.delay = el.dataset.delay;
};

FadeIn.prototype = {
 init: function () {
  this.bind();
 },
 bind: function () {
  var _t = this;
  window.addEventListener(
   'scroll',
   function () {
    _t.handler();
   },
   false
  );
  window.addEventListener(
   'DOMContentLoaded',
   function () {
    _t.handler();
   },
   false
  );
 },
 handler: function () {
  var _t = this;
  var scroll = window.scrollY; //スクロール量を取得
  var windowHeight = window.innerHeight; //画面の高さを取得
  var delay = _t.delay ? _t.delay : 0;
  var targetPos = _t.el.getBoundingClientRect().top + scroll; //ターゲット要素の位置を取得
  if (scroll > targetPos - windowHeight + 150) {
   //スクロール量 > ターゲット要素の位置
   setTimeout(function () {
    _t.el.classList.add('is-FadeIn'); //is-animatedクラスを加える
   }, delay);
  }
 },
};

modules.FadeIn = FadeIn;

/*

Instance

------------------------------ */
Array.prototype.forEach.call(document.querySelectorAll('[data-module]'), function (element) {
 var keys = element.getAttribute('data-module').split(/\s+/);
 var opts = element.getAttribute('data-options') || null;

 keys.forEach(function (key) {
  if (modules[key]) {
   var options = opts ? (keys.length > 1 ? JSON.parse(opts)[key] : JSON.parse(opts)) : {};
   if (key !== void 0) return new modules[key](element, options);
  }
 });
});
