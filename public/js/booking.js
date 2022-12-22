// ----------------function-------------------
const numberWithCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
// min
const TIME_RESERVATION = 5
const listTimer = []
// ----------------booking modal-------------------
let movieId
const selectDate = $('#select-date')
const selectCinema = $('#select-cinema')
const selectLocation = $('#select-location')

const getShowtimes = async ({ movieId, locationId, date, cinemaId }) => {
  const res = await fetch(`/api/movies/${movieId}/showtimes`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId,
      date,
      locationId,
      cinemaId,
    }),
  })
  return res.json()
}

const renderShowtimes = async ({ movieId, locationId, date, cinemaId }) => {
  const res = await getShowtimes({ movieId, locationId, date, cinemaId })
  let html = ''
  Array.from(res.showtimes).forEach((cinema) => {
    let temp = ''
    Array.from(cinema.cinemaRooms).forEach((room) => {
      Array.from(room.showtimes).forEach((showtime) => {
        temp += `
        <li>
          <form action="/booking" method="POST" class="booking-form">
            <input type="hidden" name="showtimeId" value="${showtime.id}">
            <input type="submit" class="cinema-item__showtime" value="${showtime.time.time}">
          </form>
        </li>`
      })
    })
    html += `
    <li class="col-lg-12 cinema-item">
      <div class="cinema-item__name">
        ${cinema.name}
      </div>
      <ul class="cinema-item__content">
        ${temp}
      </ul>
    </li>`
  })
  $('.cinema-list').html(html)
  $('.booking-form').submit(function (e) {
    e.preventDefault()
    if (Cookies.get('token')) {
      this.submit()
    } else {
      toast({
        title: 'Error',
        message: 'Please login after booking ticket',
        type: 'error',
        duration: 3000,
      })
    }
  })
}

const renderSelect = async (route, element) => {
  let data = await fetch(`/api/${route}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  data = await data.json()
  $(element).html(
    `<option value="">All ${route}</option>` +
      data
        .map((item) => `<option value="${item.id}">${item.name}</option>`)
        .join(''),
  )
}

$('.btn-book-ticket').on('click', async function (e) {
  e.preventDefault()
  // set default value of date picker
  selectDate.val(new Date().toISOString().slice(0, 10))

  movieId = $(this).data('movie-id')
  // render name movie
  let data = await fetch(`/api/movies/${movieId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  data = await data.json()
  $('#movie-name').text(data.name)
  // render list showtimes
  renderShowtimes({
    movieId,
    date: selectDate.val(),
  })

  // render select
  renderSelect('locations', '#select-location')
  renderSelect('cinemas', '#select-cinema')

  // show modal
  $('.buy-ticket').show()
  $('.buy-ticket-container').addClass('active')
  $('body').addClass('disable-scroll')
})

$('.buy-ticket .buy-ticket-area > a').on('click', function (e) {
  e.preventDefault()
  $('.buy-ticket').hide()
  $('.buy-ticket-container').removeClass('active')
  $('body').removeClass('disable-scroll')
})

const rerenderShowtimes = () => {
  const date = selectDate.val()
  const cinemaId = selectCinema.val()
  const locationId = selectLocation.val()
  if (cinemaId !== '') {
    renderShowtimes({
      movieId,
      date,
      cinemaId,
    })
    return
  }
  if (locationId !== '') {
    renderShowtimes({
      movieId,
      date,
      locationId,
    })
    return
  }
  renderShowtimes({
    movieId,
    date,
  })
}

// select change event
selectDate.change(rerenderShowtimes)
selectLocation.change(() => {
  selectCinema.val('')
  rerenderShowtimes()
})
selectCinema.change(() => {
  selectLocation.val('')
  rerenderShowtimes()
})

// ----------------init socket-------------------
const socket = io()

// ----------------booking page-------------------
// generate client id
const clientId =
  Date.now().toString(36) + Math.random().toString(36).substring(2)

// get tickets are selecting
const getSelectedTickets = () => {
  const result = []
  $('.store-item').each(function () {
    result.push({
      cinemaSeatId: $(this).data('cs-id'),
      name: $(this).text(),
      price: $(this).data('price'),
    })
  })
  return result
}

// render selected ticket list and total price
const renderSelectedTickets = async (selectedTickets) => {
  const totalPrice = $('#total-price')
  let html = ''
  selectedTickets = selectedTickets.sort((a, b) => a.name.localeCompare(b.name))
  for (let i = 0; i < selectedTickets.length; i++) {
    html += `
    <span data-cs-id="${selectedTickets[i].cinemaSeatId}">${selectedTickets[i].name}</span>`
    if (i !== selectedTickets.length - 1) {
      html += ', '
    } else {
      html += '.'
    }
  }
  $('#tickets-store').html(html)

  // calculate total price
  if (selectedTickets.length > 0) {
    totalPrice.text(
      numberWithCommas(
        selectedTickets.reduce((prev, curr) => prev + curr.price, 0),
      ),
    )
  } else {
    totalPrice.text('0')
  }
}
let selectedTickets = getSelectedTickets()
let showtimeId = $('#showtime-id').data('showtime-id')

// handel select ticket
$('.seat:not(.unavailable):not(.selecting)').click(function () {
  const id = $(this).data('cs-id')
  if ($(this).hasClass('active')) {
    $(this).removeClass('active')
    selectedTickets = selectedTickets.filter(
      (ticket) => ticket.cinemaSeatId !== id,
    )
    socket.emit('deselect', {
      showtimeId,
      seatId: id,
      clientId,
    })
    const item = listTimer.find(
      (item) =>
        item.showtimeId === showtimeId &&
        item.seatId === id &&
        item.clientId === clientId,
    )
    console.log(item.timer)
    window.clearTimeout(item.timer)
    listTimer.splice(listTimer.indexOf(item), 1)
  } else {
    $(this).addClass('active')
    selectedTickets.push({
      cinemaSeatId: id,
      name: $(this).data('name'),
      price: $(this).data('price'),
    })
    socket.emit('selecting', {
      showtimeId,
      seatId: id,
      clientId,
    })
    const timer = window.setTimeout(() => {
      socket.emit('deselect', {
        showtimeId,
        seatId: id,
        clientId,
      })
    }, TIME_RESERVATION * 60 * 1000)
    console.log(timer)
    listTimer.push({
      showtimeId,
      seatId: id,
      clientId,
      timer,
    })
  }
  renderSelectedTickets(selectedTickets)
})

// handel submit book tickets
$('#btn-submit-booking').click(async (e) => {
  e.preventDefault()
  const cinemaSeatsId = []
  $('#tickets-store > span').each(function () {
    cinemaSeatsId.push($(this).data('cs-id'))
  })
  if (cinemaSeatsId.length > 0) {
    let response = await fetch('/api/booking', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cinemaSeatsId,
        showtimeId,
      }),
    })
    response = await response.json()
    if (response.message === 'Booking success') {
      document.location.href = `/booking?id=${response.userTicketId}`
    } else {
      toast({
        title: 'Error',
        message: 'Booking fail. Please try again later!',
        type: 'error',
        duration: 3000,
      })
    }
  }
})

// ----------------socket booking page-------------------
// when tickets have been booked
socket.on('data', (cinemaSeatsId) => {
  $('.ticket-table-seat td.seat').each(function () {
    const seat = $(this)
    const id = seat.data('cs-id')
    if (cinemaSeatsId.includes(id)) {
      if (seat.hasClass('active')) {
        seat.removeClass('active')
      }
      seat.addClass('unavailable')
      selectedTickets = selectedTickets.filter(
        (ticket) => ticket.cinemaSeatId !== id,
      )
      renderSelectedTickets(selectedTickets)
    }
  })
})

// render tickets have been selected or deselected
const renderSelecting = (data, action) => {
  if (data.clientId !== clientId && data.showtimeId === showtimeId) {
    $('.ticket-table-seat td.seat').each(function () {
      const seat = $(this)
      if (seat.data('cs-id') === data.seatId) {
        if (action === 'add') {
          seat.addClass('selecting')
        } else {
          seat.removeClass('selecting')
        }
      }
    })
  }
}
socket.on('selecting', (data) => {
  renderSelecting(data, 'add')
})
socket.on('deselect', (data) => {
  renderSelecting(data, 'remove')
})
