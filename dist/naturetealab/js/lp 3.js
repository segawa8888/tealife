$(function () {
 var domain = window.location.hostname;
 var port = window.location.port != '' ? `:${window.location.port}` : '';
 var protocal = 'https';
 var path = `${protocal}://${domain}${port}/tealife`;
 $.ajaxSetup({ cache: false });
 $('.header').load(path + '/common/header.html');
 $('.footer').load(path + '/common/footer.html');

 // kv動画
 var vpc = document.getElementById('pcVideo');
 var vsp = document.getElementById('spVideo');
 if (vpc) {
  $(function () {
   vpc.play();
   $('.p-kv__volume').on('click', function () {
    if (vpc.muted) {
     vpc.muted = false;
     $(this).addClass('is-active');
    } else {
     vpc.muted = true;
     $(this).removeClass('is-active');
    }
   });
   $('.p-kv__volumeSp').on('click', function () {
    if (vsp.muted) {
     vsp.muted = false;
     $(this).addClass('is-active');
    } else {
     vsp.muted = true;
     $(this).removeClass('is-active');
    }
   });
  });
 }
});

// modal
$(function () {
 $('.js-modal-open').each(function () {
  $(this).on('click', function () {
   vsp.play();
   vsp.muted = false;
   var target = $(this).data('target');
   var modal = document.getElementById(target);
   $(modal).fadeIn();
   return false;
  });
 });
 $('.js-modal-close').on('click', function () {
  $('.js-modal').fadeOut();
  vsp.pause();
  vsp.muted = true;
  return false;
 });
});

// spslider
const kvSwiper = new Swiper('.p-kv__swiper', {
 slidesPerView: 1,
 loop: true,
 updateOnWindowResize: true,
 effect: 'fade',
 fadeEffect: {
  crossFade: true,
 },
 speed: 1000,
 autoplay: {
  delay: 5000,
  disableOnInteraction: false,
 },
});
