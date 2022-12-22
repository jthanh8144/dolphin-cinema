// ---------------------list users page-----------------------
const rerenderListUsers = () => {
  $.ajax({
    url: '/api/admin/users',
    method: 'GET',
  }).done((res) => {
    $('#list-users').html(
      res
        .map(
          (user) => `
            <tr>
              <th scope='row'>${user.id}</th>
              <td>${user.email}</td>
              <td>${user.fullName}</td>
              <td>${user.birthday || ''}</td>
              <td>
                <a href='/admin/users/${user.id}'>
                  <i class='fas fa-pencil-alt'></i>
                </a>
                <a href='' class='delete-user-btn' data-id='${user.id}'>
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

const addEventDelete = () => {
  $('.delete-user-btn').click(function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    swal({
      title: 'Are you sure?',
      text: 'You will delete this user!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger ml-2',
      confirmButtonText: 'Yes, delete it!',
    }).then(({ value }) => {
      if (value) {
        $.ajax({
          url: `/api/admin/users/${id}`,
          method: 'DELETE',
        })
          .done((res) => {
            swal('Deleted!', res.message, 'success')
            rerenderListUsers()
          })
          .fail((err) => {
            swal('Oh noes!', err.message, 'error')
          })
      }
    })
  })
}
addEventDelete()

// ---------------------update users page-----------------------
const updateUserForm = $('#update-user-form')
updateUserForm.submit(function (e) {
  e.preventDefault()
  const formData = updateUserForm.getFormData()
  $.ajax({
    url: updateUserForm.attr('action'),
    method: 'PUT',
    data: formData,
  })
    .done((res) => {
      swal('Done!', res.message, 'success')
    })
    .fail((error) => {
      swal('Oh noes!', error.message, 'error')
    })
})
$('#disable').click(function (e) {
  e.preventDefault()
  const id = $(this).data('id')
  const action = $(this).text()
  swal({
    title: 'Are you sure?',
    text: `You will ${
      action.includes('Enable') ? 'enable' : 'disable'
    } this user!`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-danger ml-2',
    confirmButtonText: `Yes, I'm sure!`,
  }).then(({ value }) => {
    if (value) {
      $.ajax({
        url: `/api/admin/users/${id}`,
        method: 'POST',
      })
        .done((res) => {
          swal('Success!', res.message, 'success')
          rerenderListUsers()
        })
        .fail((err) => {
          swal('Oh noes!', err.message, 'error')
        })
    }
  })
})
