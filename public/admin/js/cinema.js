// -----------------------Create / Update cinema-----------------------
const cinemaForm = $('#cinema-form')
cinemaForm.submit(function (e) {
  e.preventDefault()
  const method = cinemaForm.attr('method')
  $.ajax({
    url: cinemaForm.attr('action'),
    method,
    data: cinemaForm.getFormData(),
  })
    .done((res) => {
      swal('Done!', res.message, 'success')
      if (method === 'POST') {
        $('#cinema-form input[name=name]').val('')
        $('#cinema-form textarea').val('')
        $('#cinema-form input[name=basePrice]').val('')
      }
    })
    .fail((error) => {
      swal('Oh noes!', error.message, 'error')
    })
})

// -----------------------Delete cinema-----------------------
const addEventDelete = () => {
  $('.delete-cinema-btn').click(function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    swal({
      title: 'Are you sure?',
      text: 'You will delete this cinema!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger ml-2',
      confirmButtonText: 'Yes, delete it!',
    }).then(({ value }) => {
      if (value) {
        $.ajax({
          url: `/api/admin/cinemas/${id}`,
          method: 'DELETE',
        })
          .done((res) => {
            swal('Deleted!', res.message, 'success')
            rerenderListCinema()
          })
          .fail((err) => {
            swal('Oh noes!', err.message, 'error')
          })
      }
    })
  })
}
addEventDelete()

const rerenderListCinema = () => {
  $.ajax({
    url: '/api/admin/cinemas',
    method: 'GET',
  }).done((res) => {
    $('#list-cinema').html(
      res
        .map(
          (cinema) => `
            <tr>
              <th scope='row'>${cinema.id}</th>
              <td>${cinema.name}</td>
              <td>${cinema.location.name}</td>
              <td>${numberWithCommas(parseInt(cinema.basePrice))}</td>
              <td>
                <a href='/admin/cinemas/${cinema.id}'>
                  <i class='fas fa-pencil-alt'></i>
                </a>
                <a href='' class='delete-cinema-btn' data-id='${cinema.id}'>
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
