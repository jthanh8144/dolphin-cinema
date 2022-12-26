// -----------------------Create / Update movie-----------------------
const movieForm = $('#movie-form')
movieForm.submit(function (e) {
  e.preventDefault()
  const method = movieForm.attr('method')
  $.ajax({
    url: movieForm.attr('action'),
    method,
    data: movieForm.getFormData(),
  })
    .done((res) => {
      console.log(res)
      swal('Done!', res.message, 'success')
      if (method === 'POST') {
        $('#movie-form input[name=name]').val('')
        $('#movie-form textarea').val('')
        $('#movie-form input[name=image]').val('')
        $('#movie-form input[name=trailerUrl]').val('')
        $('#movie-form input[name=reviewScore]').val('')
        $('#movie-form input[name=releaseDate]').val('')
        $('#movie-form input[name=showtimeDuration]').val('')
        $('#movie-form input[name=writer]').val('')
        $('#movie-form input[name=director]').val('')
        $('#movie-form input[name=language]').val('')
      }
    })
    .fail((error) => {
      swal('Oh noes!', error.message, 'error')
    })
})

// -----------------------Delete movie-----------------------
const addEventDelete = () => {
  $('.delete-movie-btn').click(function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    swal({
      title: 'Are you sure?',
      text: 'You will delete this movie!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger ml-2',
      confirmButtonText: 'Yes, delete it!',
    }).then(({ value }) => {
      if (value) {
        $.ajax({
          url: `/api/admin/movies/${id}`,
          method: 'DELETE',
        })
          .done((res) => {
            swal('Deleted!', res.message, 'success')
            rerenderListMovies()
          })
          .fail((err) => {
            swal('Oh noes!', err.message, 'error')
          })
      }
    })
  })
}
addEventDelete()

// ---------------------list movies page-----------------------
const rerenderListMovies = () => {
  $.ajax({
    url: '/api/admin/movies',
    method: 'GET',
  }).done((res) => {
    $('#list-movies').html(
      res
        .map(
          (movie) => `
              <tr>
              <th scope='row'>${movie.id}</th>
              <td>${movie.name}</td>
              <td>${movie.reviewScore}</td>
              <td>${movie.releaseDate}</td>
              <td>${movie.showtimeDuration}</td>
              <td>${movie.language}</td>
              <td>
                <a href='/admin/movies/${movie.id}'>
                  <i class='fas fa-pencil-alt'></i>
                </a>
                <a href='' class='delete-movie-btn' data-id='${movie.id}'>
                  <i class='fas fa-trash'></i>
                </a>
              </td>
            </tr>`,
        )
        .join(''),
    )
    addEventDelete()
  })
}
