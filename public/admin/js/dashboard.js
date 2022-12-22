$(document).ready(() => {
  $.ajax({
    url: '/admin/default-password',
    method: 'GET',
  })
    .done(({ isDefaultPassword }) => {
      console.log(isDefaultPassword)
      if (isDefaultPassword) {
        swal({
          title: 'Change default password',
          text: 'You have not changed the default password',
          type: 'warning',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'Change now',
        }).then(({ value }) => {
          console.log(value)
          if (value) {
            window.location.replace('/admin/profile')
          }
        })
      }
    })
    .fail((error) => console.log(error))
})
