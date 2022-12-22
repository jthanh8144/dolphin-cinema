$(document).ready(() => {
  /* -------------------auth func---------------------- */
  const handleLogin = (idToken) => {
    fetch('/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
      }),
    })
      .then(() => {
        firebase.auth().signOut()
        window.location.reload()
      })
      .catch((error) => {
        toast({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 3000,
        })
      })
  }
  const handleAuthWithPassword = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => result.user)
      .then((user) => {
        if (user.emailVerified) {
          return user.getIdToken()
        } else {
          toast({
            title: 'Error',
            message: `Email isn't verified. A mail has sent to your email, please verify email!`,
            type: 'error',
            duration: 3000,
          })
          firebase.auth().currentUser.sendEmailVerification()
        }
      })
      .then((idToken) => (idToken ? handleLogin(idToken) : null))
      .catch((error) => {
        toast({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 3000,
        })
      })
  }
  const handleLoginWithGoogle = (idToken) => {
    const email = firebase.auth().currentUser.email
    fetch('/api/users/search', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.user) {
          handleLogin(idToken)
        } else {
          $('#login-form').addClass('hide')
          $('#register-pass-form').removeClass('hide')
        }
      })
  }
  const handleSendResetPasswordEmail = (email) => {
    fetch('/api/users/reset-password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
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
      .then((response) => {
        toast({
          title: 'Success',
          message: response.message,
          type: 'success',
          duration: 3000,
        })
        $('.login-area').removeClass('active')
        $('body').removeClass('disable-scroll')
      })
      .catch((error) => {
        toast({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 3000,
        })
      })
  }
  /* -------------------config and button---------------------- */
  const firebaseConfig = {
    apiKey: 'AIzaSyAAZGxoPYMAIYwIJb3d7GUEGr-T2vPVj54',
    authDomain: 'test-fbfcd.firebaseapp.com',
    databaseURL: 'https://test-fbfcd-default-rtdb.firebaseio.com',
    projectId: 'test-fbfcd',
    storageBucket: 'test-fbfcd.appspot.com',
    messagingSenderId: '314875589887',
    appId: '1:314875589887:web:55bc19c76a0502a72348ca',
    measurementId: 'G-NQ5EN3H46F',
  }
  firebase.initializeApp(firebaseConfig)
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  $('#btn-login-google').click((e) => {
    e.preventDefault()
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/user.birthday.read')
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => result.user.getIdToken())
      .then(handleLoginWithGoogle)
      .catch(() => {
        toast({
          title: 'Error',
          message: 'Something is error!',
          type: 'error',
          duration: 3000,
        })
      })
  })
  $('.signup-switch').click(() => {
    $('#login-form').addClass('hide')
    $('#register-form').removeClass('hide')
  })
  $('.login-switch').click(() => {
    $('#login-form').removeClass('hide')
    $('#register-form').addClass('hide')
  })
  $('.forgot-password span').click(() => {
    $('#login-form').addClass('hide')
    $('#forgot-pass-form').removeClass('hide')
  })
  /* -------------------validate and submit---------------------- */
  Validator({
    form: '#login-form',
    formGroupSelector: '.input-wrap',
    errorSelector: '.form-message',
    rules: [
      Validator.isRequired(
        '#login-form input[name=email]',
        'Email is required',
      ),
      Validator.isEmail('#login-form input[name=email]', 'Invalid email'),
      Validator.isRequired(
        '#login-form input[name=password]',
        'Password is required',
      ),
      Validator.minLength('#login-form input[name=password]', 6, 'Mật khẩu'),
    ],
    onsubmit: (formValues) => {
      const { email, password } = formValues
      handleAuthWithPassword(email, password)
    },
  })
  Validator({
    form: '#register-form',
    formGroupSelector: '.input-wrap',
    errorSelector: '.form-message',
    rules: [
      Validator.isRequired(
        '#register-form input[name=email]',
        'Email is required',
      ),
      Validator.isEmail('#register-form input[name=email]', 'Invalid email'),
      Validator.isRequired(
        '#register-form input[name=name]',
        'Full name is required',
      ),
      Validator.isRequired(
        '#register-form input[name=password]',
        'Password is required',
      ),
      Validator.minLength('#register-form input[name=password]', 6, 'Mật khẩu'),
      Validator.isRequired(
        '#register-form input[name=cf_pass]',
        'Confirm password is required',
      ),
      Validator.isConfirmed(
        '#register-form input[name=cf_pass]',
        () => {
          return document.querySelector('#register-form input[name=password]')
            .value
        },
        'Mật khẩu',
      ),
    ],
    onsubmit: (formValues) => {
      const { email, name, password } = formValues
      fetch('/api/users/search', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      })
        .then((response) => {
          if (response.status === 400) {
            toast({
              title: 'Error',
              message: 'Email is illegal!',
              type: 'error',
              duration: 3000,
            })
          } else {
            return response.json()
          }
        })
        .then((response) => {
          if (response) {
            if (response.user) {
              toast({
                title: 'Error',
                message: 'Email is existed!',
                type: 'error',
                duration: 3000,
              })
            } else {
              firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                  toast({
                    title: 'Success',
                    message:
                      'A mail has sent to your email to confirm account!',
                    type: 'success',
                    duration: 3000,
                  })
                  return firebase.auth().currentUser.sendEmailVerification()
                })
                .then(() =>
                  firebase.auth().currentUser.updateProfile({
                    displayName: name,
                  }),
                )
                .then(() => window.location.reload())
                .catch((error) => {
                  toast({
                    title: 'Error',
                    message: error.message,
                    type: 'error',
                    duration: 3000,
                  })
                })
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
  })
  Validator({
    form: '#register-pass-form',
    formGroupSelector: '.input-wrap',
    errorSelector: '.form-message',
    rules: [
      Validator.isRequired(
        '#register-pass-form input[name=password]',
        'Confirm password is required',
      ),
      Validator.isRequired(
        '#register-pass-form input[name=cf_pass]',
        'Confirm password is required',
      ),
      Validator.isConfirmed(
        '#register-pass-form input[name=cf_pass]',
        () => {
          return document.querySelector(
            '#register-pass-form input[name=password]',
          ).value
        },
        'Mật khẩu',
      ),
    ],
    onsubmit: (formValues) => {
      const { password } = formValues
      const user = firebase.auth().currentUser
      user
        .updatePassword(password)
        .then(() => user.getIdToken())
        .then(handleLogin)
    },
  })
  Validator({
    form: '#forgot-pass-form',
    formGroupSelector: '.input-wrap',
    errorSelector: '.form-message',
    rules: [
      Validator.isRequired(
        '#forgot-pass-form input[name=email]',
        'Confirm password is required',
      ),
      Validator.isEmail(
        '#forgot-pass-form input[name=email]',
        'Email is invalid!',
      ),
    ],
    onsubmit: (formValues) => {
      const { email } = formValues
      console.log(email)
      fetch('/api/users/search', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json().then((result) => Promise.resolve(result))
          } else {
            return response.text().then(() =>
              Promise.reject({
                message: 'Email is invalid!',
              }),
            )
          }
        })
        .then((response) => {
          if (response.user) {
            handleSendResetPasswordEmail(email)
          } else {
            toast({
              title: 'Error',
              message: `Email is invalid!`,
              type: 'error',
              duration: 3000,
            })
          }
        })
        .catch((error) => {
          toast({
            title: 'Something is error!',
            message: error.message,
            type: 'error',
            duration: 3000,
          })
        })
    },
  })
})
