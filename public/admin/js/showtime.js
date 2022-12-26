// -----------------------Create / Update showtimes-----------------------
const showtimesForm = $('#showtimes-form')
showtimesForm.submit(function (e) {
  e.preventDefault()
  const method = showtimesForm.attr('method')
  $.ajax({
    url: showtimesForm.attr('action'),
    method,
    data: showtimesForm.getFormData(),
  })
    .done((res) => {
      console.log(res)
      swal('Done!', res.message, 'success')
      // if (method === 'POST') {
      //   $('#showtimes-form input[name=cinemaRoom]').val('')
      //   $('#showtimes-form input[name=cinema]').val('')
      //   $('#showtimes-form input[name=movie]').val('')
      //   $('#showtimes-form input[name=time]').val('')
      //   $('#showtimes-form input[name=showDate]').val('')
      // }
    })
    .fail((error) => {
      swal('Oh noes!', error.message, 'error')
    })
})

// -----------------------Delete showtimes-----------------------
const addEventDelete = () => {
  $('.delete-showtime-btn').click(function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    swal({
      title: 'Are you sure?',
      text: 'You will delete this showtimes!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger ml-2',
      confirmButtonText: 'Yes, delete it!',
    }).then(({ value }) => {
      if (value) {
        $.ajax({
          url: `/api/admin/showtimes/${id}`,
          method: 'DELETE',
        })
          .done((res) => {
            swal('Deleted!', res.message, 'success')
            rerenderShowtimes()
          })
          .fail((err) => {
            swal('Oh noes!', err.message, 'error')
          })
      }
    })
  })
}
addEventDelete()

// ---------------------list showtimes page-----------------------
const rerenderShowtimes = () => {
  $.ajax({
    url: '/api/admin/showtimes',
    method: 'GET',
  }).done((res) => {
    $('#list-showtimes').html(
      res
        .map(
          (showtimes) => `
            <tr>
              <th scope='row'>${showtimes.id}</th>
              <td>${showtimes.cinemaRoom}, ${showtimes.cinema}</td>
              <td>${showtimes.time}</td>
              <td>${showtimes.movie}</td>
              <td>${showtimes.showDate}</td>
              <td>
                <a href='/admin/showtimes/${showtimes.id}'>
                  <i class='fas fa-pencil-alt'></i>
                </a>
                <a href='' class='delete-showtimes-btn' data-id='${showtimes.id}'>
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
