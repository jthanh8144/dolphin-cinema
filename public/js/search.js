const getQueryParams = (query) => {
  let match
  const pl = /\+/g
  const search = /([^&=]+)=?([^&]*)/g
  ;(decode = function (s) {
    return decodeURIComponent(s.replace(pl, ' '))
  }),
    (query = window.location.search.substring(1))
  urlParams = {}
  while ((match = search.exec(query))) {
    urlParams[decode(match[1])] = decode(match[2])
  }
  return urlParams
}
$(document).ready(() => {
  if (
    window.location.pathname === '/movies' &&
    window.location.href.indexOf('?') !== -1
  ) {
    $('#search-form select').val(Object.keys(getQueryParams())[0])
    $('#search-form input').val(Object.values(getQueryParams())[0])
  }
})
let page = 1
let max = 0
const searchGrid = $('.search-item-grid')
const searchList = $('.search-item-list')
$('#search-form').submit(function (e) {
  e.preventDefault()
  const input = $('#search-form input')
  input.attr('name', $('#search-form select').val())
  if (input.val()) {
    page = 1
    this.submit()
  }
})
$('#load-more').on('click', async function (e) {
  e.preventDefault()
  let htmlGrid = ''
  let htmlList = ''
  let params = getQueryParams()
  $.ajax({
    url: `/api/movies/count?${Object.keys(params)[0]}=${
      Object.values(params)[0]
    }&page=${page}`,
    method: 'GET',
  }).done((data) => {
    max = data.countPage
  })
  page++
  await $.ajax({
    url: `/api/movies?${Object.keys(params)[0]}=${
      Object.values(params)[0]
    }&page=${page}`,
    method: 'GET',
  })
    .done((data) => {
      htmlGrid += data
        .map((movie) => {
          let result = ''
          for (let i = 0; i < movie.reviewScore; i++) {
            result += `<i class='fa-solid fa-star'></i>`
          }
          for (let i = 0; i < 5 - movie.reviewScore; i++) {
            result += `<i class='fa-regular fa-star'></i>`
          }
          return `
            <div class='col-lg-3 col-md-4 col-sm-6 top single-search-wrap'>
              <div class='single-search'>
                <div class='single-search-img'>
                  <img src='${movie.image}' alt='search' />
                  <a
                    href='https://www.youtube.com/watch?v=RZXnugbhw_4'
                    class='popup-youtube'
                  >
                    <i class='icofont icofont-ui-play'></i>
                  </a>
                </div>
                <div class='search-content'>
                  <h2><a href='/movies/${movie.id}'>${movie.name}</a></h2>
                  <div class='review'>
                    <div class='author-review'>
                      ${result}
                    </div>
                    <h4>${movie.countRatings} voters</h4>
                  </div>
                </div>
              </div>
            </div>`
        })
        .join('')
      htmlList += data
        .map((movie) => {
          let result = ''
          for (let i = 0; i < movie.reviewScore; i++) {
            result += `<i class='fa-solid fa-star'></i>`
          }
          for (let i = 0; i < 5 - movie.reviewScore; i++) {
            result += `<i class='fa-regular fa-star'></i>`
          }
          return `
          <div class='col-lg-12 col-md-12 col-sm-12 search-item'>
            <div class='search-item-img'>
              <img src='${movie.image}' alt='movie'>
            </div>
            <div class='search-item-content'>
              <h3 class='search-item-title'>
                <a href='/movies/${movie.id}'>${movie.name}</a>
              </h3>
              <div class='search-item-score'>
                <div class='author-review'>
                  ${result}
                </div>
                <h4>${movie.countRatings} voters</h4>
              </div>
              <div class='search-item-desc'>
                ${movie.description}
              </div>
            </div>
          </div>
          `
        })
        .join('')
    })
    .fail((err) => {
      console.log(err)
    })
  searchGrid.html(searchGrid.html() + htmlGrid)
  searchList.html(searchList.html() + htmlList)
  $('#count-item').text($('.single-search').length)
  if (page === max) {
    $('#load-more').addClass('hidden')
  }
})

$('.view-mode-item:first-child').click(function () {
  $('.view-mode-item:last-child').toggleClass('active')
  $(this).toggleClass('active')
  $('.search-item-list').addClass('hide')
  $('.search-item-grid').removeClass('hide')
})

$('.view-mode-item:last-child').click(function () {
  $('.view-mode-item:first-child').toggleClass('active')
  $(this).toggleClass('active')
  $('.search-item-grid').addClass('hide')
  $('.search-item-list').removeClass('hide')
})
