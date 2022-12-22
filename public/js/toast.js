const toast = ({
  title = '',
  message = '',
  type = 'info',
  duration = 3000,
}) => {
  const main = document.getElementById('toast')
  if (main) {
    const toast = document.createElement('div')

    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast)
    }, duration + 1000)

    toast.onclick = function (e) {
      if (e.target.closest('.toast__close')) {
        main.removeChild(toast)
        clearTimeout(autoRemoveId)
      }
    }

    const icons = {
      success: 'fas fa-check-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-circle',
      error: 'fas fa-exclamation-circle',
    }
    const icon = icons[type]
    toast.classList.add('toast', `toast--${type}`)
    toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${(
      duration / 1000
    ).toFixed(2)}s forwards`
    toast.innerHTML = `
        <div class="toast__icon">
            <i class="${icon}"></i>
        </div>
        <div class="toast__body">
            <h3 class="toast__title">${title}</h3>
            <p class="toast__msg">${message}</p>
        </div>
        <div class="toast__close">
            <i class="fas fa-times"></i>
        </div>
        `
    main.appendChild(toast)
  }
}
/* Config */
/*
toast({
  title: 'Thành công',
  message: 'Đăng nhập tài khoản thành công!',
  type: 'success',
  duration: 3000,
})
toast({
  title: 'Thông báo',
  message: 'Xin chào bạn, cảm ơn bạn đã sử dụng dịch vụ!',
  type: 'info',
  duration: 3000,
})
toast({
  title: 'Cảnh báo',
  message: 'Bạn sắp truy cập quá số lần quy định!',
  type: 'warning',
  duration: 3000,
})
toast({
  title: 'Thất bại',
  message: 'Có lỗi xảy ra, vui lòng thử lại sau!',
  type: 'error',
  duration: 3000,
})
*/
