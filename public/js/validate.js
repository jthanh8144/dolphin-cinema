const Validator = (options) => {
  const getParent = (element, selector) => {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement
      }
      element = element.parentElement
    }
  }

  let selectorRules = {}

  function Validate(inputElement, rule) {
    let errorMessage
    const errorElement = getParent(
      inputElement,
      options.formGroupSelector,
    ).querySelector(options.errorSelector)
    const rules = selectorRules[rule.selector]

    for (let i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ':checked'),
          )
          break
        default:
          errorMessage = rules[i](inputElement.value)
      }
      if (errorMessage) break
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage
      getParent(inputElement, options.formGroupSelector).classList.add(
        'invalid',
      )
    } else {
      errorElement.innerText = ''
      getParent(inputElement, options.formGroupSelector).classList.remove(
        'invalid',
      )
    }
    return !errorMessage
  }

  const formElement = document.querySelector(options.form)
  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault()

      let isFormValid = true

      options.rules.forEach(function (rule) {
        const inputElement = formElement.querySelector(rule.selector)
        const isValid = Validate(inputElement, rule)
        if (!isValid) {
          isFormValid = false
        }
      })
      if (isFormValid) {
        // Submit với js
        if (typeof options.onsubmit === 'function') {
          const enableInputs = formElement.querySelectorAll(
            '[name]:not([disabled])',
          )
          const formValues = Array.from(enableInputs).reduce(function (
            values,
            input,
          ) {
            switch (input.type) {
              case 'radio':
                values[input.name] = formElement.querySelector(
                  'input[name="' + input.name + '"]:checked',
                ).value
                break
              case 'checkbox':
                if (!input.matches(':checked')) {
                  values[input.name] = ''
                  return values
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = []
                }
                values[input.name].push(input.value)
                break
              case 'file':
                values[input.name] = input.files
                break
              default:
                values[input.name] = input.value
            }
            return values
          },
          {})
          options.onsubmit(formValues)
        }
        // Submit với html
        else {
          formElement.submit()
        }
      }
    }

    options.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test)
      } else {
        selectorRules[rule.selector] = [rule.test]
      }
      const inputElements = formElement.querySelectorAll(rule.selector)
      Array.from(inputElements).forEach(function (inputElement) {
        // Xử lí trường hợp blur khỏi input
        inputElement.onblur = function () {
          Validate(inputElement, rule)
        }

        // Xử lí mỗi khi nhập vào
        inputElement.oninput = function () {
          const errorElement = getParent(
            inputElement,
            options.formGroupSelector,
          ).querySelector('.form-message')
          errorElement.innerText = ''
          getParent(inputElement, options.formGroupSelector).classList.remove(
            'invalid',
          )
        }
      })
    })
  }
}

// rule
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || 'Vui lòng nhập trường này!'
    },
  }
}

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      const regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return regex.test(value)
        ? undefined
        : message || 'Trường này phải là email'
    },
  }
}

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : `${message} phải có tối thiểu ${min} kí tự`
    },
  }
}

Validator.isConfirmed = function (selector, getRePass, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getRePass() ? undefined : `${message} không khớp!`
    },
  }
}

Validator.isNumber = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      const regex = /^\d+$/
      return regex.test(value) ? undefined : 'Trường này chỉ bao gồm số'
    },
  }
}

// Config
/*
Validator({
    form: '#form-1',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#fullname', 'Vui lòng nhập họ tên!'),
        Validator.isRequired('#email'),
        Validator.isEmail('#email'),
        Validator.isRequired('#password'),
        Validator.minLength('#password', 6, 'Mật khẩu'),
        Validator.isRequired('#re-password'),
        Validator.isConfirmed('#re-password', function() {
            return document.querySelector('#form-1 #password').value;
        }, 'Mật khẩu'),
        Validator.isRequired('#avatar', 'Vui lòng chọn một file'),
        Validator.isRequired('select', 'Vui lòng chọn khu vực!'),
        Validator.isRequired('input[type="radio"]', 'Vui lòng chọn giới tính!'),
        Validator.isRequired('input[type="checkbox"]', 'Vui lòng chọn ít nhất một sở thích!')
    ],
    onsubmit: function(data) {
        // Call API
        console.log(data);
    }
});
*/
