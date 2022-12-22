const previewAvatar = (input) => {
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = function (e) {
      $('.img-account-profile').attr('src', e.target.result)
    }
    reader.readAsDataURL(input.files[0])
  }
}

$('#avatar-input').change(function () {
  previewAvatar(this)
  if ($('.submit-change').attr('hidden')) {
    $('.submit-change').removeAttr('hidden')
  }
})

const updateProfileForm = $('#update-profile-form')
updateProfileForm.submit(function (e) {
  e.preventDefault()
  $.ajax({
    url: updateProfileForm.attr('action'),
    method: updateProfileForm.attr('method'),
    data: updateProfileForm.getFormData(),
  })
    .done((res) => {
      swal('Done!', res.message, 'success')
    })
    .fail((error) => {
      swal('Oh noes!', error.message, 'error')
    })
})

const updatePasswordForm = $('#update-password-form')
updatePasswordForm.submit(function (e) {
  e.preventDefault()
  $.ajax({
    url: updatePasswordForm.attr('action'),
    method: updatePasswordForm.attr('method'),
    data: updatePasswordForm.getFormData(),
  })
    .done((res) => {
      swal('Done!', res.message, 'success')
    })
    .fail((error) => {
      swal('Oh noes!', error.responseJSON.message, 'error')
    })
})
