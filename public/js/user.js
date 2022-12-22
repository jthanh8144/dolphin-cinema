$('.portfolio-menu li')[1].click()
setTimeout(() => $('.portfolio-menu li')[0].click(), 100)
Validator({
  form: '#update-user-form',
  formGroupSelector: '.form-group',
  errorSelector: '.form-message',
  rules: [
    Validator.isRequired(
      '#update-user-form input[name=fullName]',
      'Full name is required',
    ),
    Validator.isRequired(
      '#update-user-form input[name=birthday]',
      'Birthday is required',
    ),
  ],
  onsubmit: (formValues) => {
    const { fullName, birthday } = formValues
    fetch('/api/users/profiles', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        birthday,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        toast({
          title: 'Success',
          message: result.message,
          type: 'success',
          duration: 3000,
        })
        $('.header-right__username').text(`Welcome ${fullName}!`)
      })
      .catch((error) => {
        toast({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 3000,
        })
      })
  },
})
Validator({
  form: '#update-password-form',
  formGroupSelector: '.form-group',
  errorSelector: '.form-message',
  rules: [
    Validator.isRequired(
      '#update-password-form input[name=oldPassword]',
      'Old password is required',
    ),
    Validator.isRequired(
      '#update-password-form input[name=newPassword]',
      'New password is required',
    ),
    Validator.minLength(
      '#update-password-form input[name=oldPassword]',
      6,
      'Mật khẩu',
    ),
    Validator.minLength(
      '#update-password-form input[name=newPassword]',
      6,
      'Mật khẩu',
    ),
    Validator.isRequired(
      '#update-password-form input#cf-pass',
      'Confirm password is required',
    ),
    Validator.isConfirmed(
      '#update-password-form input#cf-pass',
      () => {
        return document.querySelector(
          '#update-password-form input[name=newPassword]',
        ).value
      },
      'Mật khẩu',
    ),
  ],
  onsubmit: (formValues) => {
    const { oldPassword, newPassword } = formValues
    fetch('/api/users/password', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((result) => Promise.resolve(result))
        } else {
          return response
            .text()
            .then((result) => JSON.parse(result))
            .then((result) =>
              Promise.reject({
                message: result.message,
              }),
            )
        }
      })
      .then((result) => {
        toast({
          title: 'Success',
          message: result.message,
          type: 'success',
          duration: 3000,
        })
      })
      .catch((error) => {
        toast({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 3000,
        })
      })
    $('#update-password-form input[name=oldPassword]').val('')
    $('#update-password-form input[name=newPassword]').val('')
    $('#update-password-form input#cf-pass').val('')
  },
})

// -----------------------Upload avatar-------------------------
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
  $('.submit-change').attr('hidden', false)
})
