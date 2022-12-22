;(function ($) {
  'use strict'

  /*----------------------------
    Responsive menu Active
    ------------------------------ */
  $('.mainmenu ul#primary-menu').slicknav({
    allowParentLinks: true,
    prependTo: '.responsive-menu',
  })

  /*----------------------------
    START - Scroll to Top
    ------------------------------ */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 600) {
      $('.scrollToTop').fadeIn()
    } else {
      $('.scrollToTop').fadeOut()
    }
  })
  $('.scrollToTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 2000)
    return false
  })
  $('.login-popup').on('click', function () {
    $('.login-area').addClass('active')
    $('body').addClass('disable-scroll')
    const loginForm = $('#login-form')
    if (loginForm.hasClass('hide')) {
      loginForm.removeClass('hide')
    }
    $('#register-form').hasClass('hide')
      ? null
      : $('#register-form').addClass('hide')
    $('#register-pass-form').hasClass('hide')
      ? null
      : $('#register-pass-form').addClass('hide')
    $('#forgot-pass-form').hasClass('hide')
      ? null
      : $('#forgot-pass-form').addClass('hide')
    return false
  })
  $('.login-box > a').on('click', function () {
    $('.login-area').removeClass('active')
    $('body').removeClass('disable-scroll')
    return false
  })

  /*----------------------------
    START - Slider activation
    ------------------------------ */
  let heroSlider = $('.hero-area-slider')
  heroSlider.owlCarousel({
    loop: true,
    dots: true,
    autoplay: false,
    autoplayTimeout: 4000,
    nav: false,
    items: 1,
    responsive: {
      992: {
        dots: false,
      },
    },
  })
  heroSlider.on('changed.owl.carousel', function (property) {
    let current = property.item.index
    let prevRating = $(property.target)
      .find('.owl-item')
      .eq(current)
      .prev()
      .find('.hero-area-slide')
      .html()
    let nextRating = $(property.target)
      .find('.owl-item')
      .eq(current)
      .next()
      .find('.hero-area-slide')
      .html()
    $('.thumb-prev .hero-area-slide').html(prevRating)
    $('.thumb-next .hero-area-slide').html(nextRating)
  })
  $('.thumb-next').on('click', function () {
    heroSlider.trigger('next.owl.carousel', [300])
    return false
  })
  $('.thumb-prev').on('click', function () {
    heroSlider.trigger('prev.owl.carousel', [300])
    return false
  })
  let newsSlider = $('.news-slider')
  newsSlider.owlCarousel({
    loop: true,
    dots: true,
    autoplay: false,
    autoplayTimeout: 4000,
    nav: false,
    items: 1,
    responsive: {
      992: {
        dots: false,
      },
    },
  })
  newsSlider.on('changed.owl.carousel', function (property) {
    let current = property.item.index
    let prevRating = $(property.target)
      .find('.owl-item')
      .eq(current)
      .prev()
      .find('.single-news')
      .html()
    let nextRating = $(property.target)
      .find('.owl-item')
      .eq(current)
      .next()
      .find('.single-news')
      .html()
    $('.news-prev .single-news').html(prevRating)
    $('.news-next .single-news').html(nextRating)
  })
  $('.news-next').on('click', function () {
    newsSlider.trigger('next.owl.carousel', [300])
    return false
  })
  $('.news-prev').on('click', function () {
    newsSlider.trigger('prev.owl.carousel', [300])
    return false
  })
  let videoSlider = $('.video-slider')
  videoSlider.owlCarousel({
    loop: true,
    dots: true,
    autoplay: false,
    autoplayTimeout: 4000,
    nav: false,
    responsive: {
      0: {
        items: 1,
        margin: 0,
      },
      576: {
        items: 2,
        margin: 30,
      },
      768: {
        items: 3,
        margin: 30,
      },
      992: {
        items: 4,
        margin: 30,
      },
    },
  })

  /*----------------------------
	START - videos popup
	------------------------------ */
  $('.popup-youtube').magnificPopup({ type: 'iframe' })
  $('.btn-trailer').magnificPopup({ type: 'iframe' })
  //iframe scripts
  $.extend(true, $.magnificPopup.defaults, {
    iframe: {
      patterns: {
        //youtube videos
        youtube: {
          index: 'youtube.com/',
          id: 'v=',
          src: 'https://www.youtube.com/embed/%id%?autoplay=1',
        },
      },
    },
  })

  /*----------------------------
    START - Isotope
    ------------------------------ */
  jQuery('.portfolio-item').isotope()
  $('.portfolio-menu li').on('click', function () {
    $('.portfolio-menu li').removeClass('active')
    $(this).addClass('active')
    let selector = $(this).attr('data-filter')
    $('.portfolio-item').isotope({
      filter: selector,
    })
  })
  $(document).ready(() => {
    $('.portfolio-menu li')[2].click()
    // setTimeout(() => $('.portfolio-menu li')[0].click(), 1000)
  })
  /*----------------------------
    START - Preloader
    ------------------------------ */
  jQuery(window).load(function () {
    jQuery('#preloader').fadeOut(500)
  })
})(jQuery)
