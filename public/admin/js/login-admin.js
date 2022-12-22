;(function ($) {
  $.fn.getFormData = function () {
    const dataArray = $(this).serializeArray()
    return dataArray.reduce((obj, item) => {
      obj[item.name] = item.value
      return obj
    }, {})
  }
})(jQuery)
$(document).ready(() => {
  /* -------------------auth---------------------- */
  const handleLogin = (idToken) => {
    fetch('/admin/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'CSRF-Token': Cookies.get('XSRF-TOKEN'),
      },
      body: JSON.stringify({
        idToken,
      }),
    })
      .then(() => {
        firebase.auth().signOut()
        window.location.href = '/admin'
      })
      .catch(() => {
        toast({
          title: 'Error',
          message: 'Something is error!',
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
          return
        }
      })
      .then((idToken) => (idToken ? handleLogin(idToken) : null))
      .catch(() => {
        toast({
          title: 'Error',
          message: 'Something is error!',
          type: 'error',
          duration: 3000,
        })
      })
  }
  const firebaseConfig = {
    apiKey: 'AIzaSyAAZGxoPYMAIYwIJb3d7GUEGr-T2vPVj54',
    authDomain: 'test-fbfcd.firebaseapp.com',
    databaseURL: 'https://test-fbfcd-default-rtdb.firebaseio.com',
    projectId: 'test-fbfcd',
    storageBucket: 'test-fbfcd.appspot.com',
    messagingSenderId: '314875589887',
    appId: '1:314875589887:web:e28f1feec224f5512348ca',
    measurementId: 'G-QT7HMP4MGD',
  }
  firebase.initializeApp(firebaseConfig)
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  /* -------------------validate and submit---------------------- */
  Validator({
    form: '#login-admin-form',
    formGroupSelector: '.input-wrap',
    errorSelector: '.form-message',
    rules: [
      Validator.isRequired(
        '#login-admin-form input[name=email]',
        'Email is required',
      ),
      Validator.isEmail('#login-admin-form input[name=email]', 'Invalid email'),
      Validator.isRequired(
        '#login-admin-form input[name=password]',
        'Password is required',
      ),
      Validator.minLength(
        '#login-admin-form input[name=password]',
        6,
        'Mật khẩu',
      ),
    ],
    onsubmit: (formValues) => {
      const { email, password } = formValues
      handleAuthWithPassword(email, password)
    },
  })
})
