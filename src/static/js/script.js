window.addEventListener('DOMContentLoaded', () => {
 // サムネイルのスライダー
 const thumbnail = new Swiper('.p-detail-thumbnail', {
  freeMode: true,
  slidesPerView: 5,
  spaceBetween: 15,
  watchSlidesVisibility: true,
  watchSlidesProgress: true,
  breakpoints: {
   768: {
    spaceBetween: 25,
   },
  },
 });

 // メインのスライダー
 const slider = new Swiper('.p-detail-slider', {
  effect: 'fade',
  loop: true,
  thumbs: {
   swiper: thumbnail,
  },
 });
});
