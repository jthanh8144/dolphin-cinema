// -----------------------Create / Update cinema seat-----------------------
const cinemaSeatForm = $('#cinema-seat-form')
cinemaSeatForm.submit(function (e) {
  e.preventDefault()
  const method = cinemaSeatForm.attr('method')
  $.ajax({
    url: cinemaSeatForm.attr('action'),
    method,
    data: cinemaSeatForm.getFormData(),
  })
    .done((res) => {
      swal('Done!', res.message, 'success')
    })
    .fail((error) => {
      swal('Oh noes!', error.message, 'error')
    })
})

// -----------------------Delete cinema seat-----------------------
const addEventDelete = () => {
  $('.delete-seat-btn').click(function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    swal({
      title: 'Are you sure?',
      text: 'You will delete this cinema seat!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger ml-2',
      confirmButtonText: 'Yes, delete it!',
    }).then(({ value }) => {
      if (value) {
        $.ajax({
          url: `/api/admin/cinema-seats/${id}`,
          method: 'DELETE',
        })
          .done((res) => {
            swal('Deleted!', res.message, 'success')
            rerenderListCinemaSeat()
          })
          .fail((err) => {
            swal('Oh noes!', err.message, 'error')
          })
      }
    })
  })
}
addEventDelete()

const rerenderListCinemaSeat = () => {
  $.ajax({
    url: `/api/admin/cinema-seats?roomId=${$('#room-id').val()}`,
    method: 'GET',
  }).done((res) => {
    $('#list-cinema-seats').html(
      res.length > 0
        ? res
            .map(
              (seat) => `
                <tr>
                  <th scope='row'>${seat.id}</th>
                  <td>${seat.cinemaRoom.name}</td>
                  <td>${seat.cinemaRoom.cinema.name}</td>
                  <td>${seat.seat.row + seat.seat.column}</td>
                  <td>${seat.seatType.name}</td>
                  <td>
                    <a href='/admin/cinema-seats/${seat.id}'>
                      <i class='fas fa-pencil-alt'></i>
                    </a>
                    <a href='' class='delete-seat-btn' data-id='${seat.id}'>
                      <i class='fas fa-trash'></i>
                    </a>
                  </td>
                </tr>`,
            )
            .join('')
        : `
        <tr>
          <th class='text-center' colspan='6'>This room hasn't seat!</th>
        </tr>`,
    )
    addEventDelete()
  })
}

// -----------------------Form cinema seat change select-----------------------
$('#select-cinema').change(function () {
  $.ajax({
    url: `/api/admin/cinemas/${$(this).val()}/rooms`,
    method: 'GET',
  })
    .done((res) => {
      console.log(res)
      $('#select-room').html(
        res
          .map((room) => `<option value='${room.id}'>${room.name}</option>`)
          .join(''),
      )
    })
    .fail((error) => console.log(error))
})
