const addEventDelete = () => {
  $('.delete-admin-btn').click(function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    swal({
      title: 'Are you sure?',
      text: 'You will delete this administrator!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger ml-2',
      confirmButtonText: 'Yes, delete it!',
    }).then(({ value }) => {
      if (value) {
        $.ajax({
          url: `/api/admin/administrators/${id}`,
          method: 'DELETE',
        })
          .done((res) => {
            swal('Deleted!', res.message, 'success')
            rerenderListAdmin()
          })
          .fail((err) => {
            swal('Oh noes!', err.message, 'error')
          })
      }
    })
  })
}
addEventDelete()

const rerenderListAdmin = () => {
  $.ajax({
    url: '/api/admin/administrators',
    method: 'GET',
  }).done((res) => {
    $('#list-admin').html(
      res
        .map(
          (admin) => `
            <tr>
              <th scope='row'>${admin.id}</th>
              <td>${admin.email}</td>
              <td>${admin.fullName}</td>
              <td>${admin.role}</td>
              <td>
                <a href='/admin/administrators/${admin.id}'>
                  <i class='fas fa-pencil-alt'></i>
                </a>
                <a href='' class='delete-admin-btn' data-id='${admin.id}'>
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

const adminForm = $('#admin-form')
adminForm.submit(function (e) {
  e.preventDefault()
  const formData = adminForm.getFormData()
  const action = adminForm.attr('action')
  if (adminForm.attr('method') === 'POST') {
    $.ajax({
      url: '/api/admin/administrators/search',
      method: 'POST',
      data: { email: formData.email },
    }).done((admin) => {
      if (admin) {
        swal('Oh noes!', 'Admin is existed!', 'error')
      } else {
        $.ajax({
          url: action,
          method: 'POST',
          data: formData,
        })
          .done((res) => {
            swal('Done!', res.message, 'success')
            $('#admin-form input[name=email]').val('')
            $('#admin-form input[name=fullName]').val('')
            $('#admin-form select').val('admin')
          })
          .fail((error) => {
            swal('Oh noes!', error.message, 'error')
          })
      }
    })
  } else {
    $.ajax({
      url: action,
      method: 'PUT',
      data: formData,
    })
      .done((res) => {
        swal('Done!', res.message, 'success')
      })
      .fail((error) => {
        swal('Oh noes!', error.message, 'error')
      })
  }
})

$('#rs-password').click(function (e) {
  e.preventDefault()
  $.ajax({
    url: `/api/admin/administrators/${id}`,
    method: 'POST',
  })
    .done((res) => {
      swal('Done!', res.message, 'success')
    })
    .fail((err) => {
      swal('Oh noes!', err.message, 'error')
    })
})
