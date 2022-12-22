import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import {
  Cinema,
  CinemaSeat,
  Comment,
  Location,
  Movie,
  Seat,
  SeatType,
  Showtime,
  Ticket,
  Time,
  User,
  UserRating,
  UserTicket,
  CinemaRoom,
} from '../../app/entities'

export default class InitialDatabaseSeed implements Seeder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const users = await factory(User)().createMany(20)
    const movies = await factory(Movie)().createMany(20)
    const locations = await factory(Location)().createMany(20)
    const cinemas = await factory(Cinema)()
      .map(async (cinema) => {
        cinema.location =
          locations[Math.floor(Math.random() * locations.length)]
        return cinema
      })
      .createMany(20)
    const times = await factory(Time)().createMany(20)
    const seats = await factory(Seat)().createMany(20)
    const cinemaRooms = await factory(CinemaRoom)()
      .map(async (cinemaRoom) => {
        cinemaRoom.cinema = cinemas[Math.floor(Math.random() * cinemas.length)]
        return cinemaRoom
      })
      .createMany(20)
    await factory(UserRating)()
      .map(async (rating) => {
        rating.user = users[Math.floor(Math.random() * users.length)]
        rating.movie = movies[Math.floor(Math.random() * movies.length)]
        return rating
      })
      .createMany(5)
    await factory(Comment)()
      .map(async (cmt) => {
        cmt.user = users[Math.floor(Math.random() * users.length)]
        cmt.movie = movies[Math.floor(Math.random() * movies.length)]
        return cmt
      })
      .createMany(5)
    const showtimes = await factory(Showtime)()
      .map(async (showtime) => {
        showtime.cinemaRoom =
          cinemaRooms[Math.floor(Math.random() * cinemaRooms.length)]
        showtime.time = times[Math.floor(Math.random() * times.length)]
        showtime.movie = movies[Math.floor(Math.random() * movies.length)]
        return showtime
      })
      .createMany(5)
    const seatTypes = await factory(SeatType)().createMany(10)
    const cinemaSeats = await factory(CinemaSeat)()
      .map(async (cs) => {
        cs.cinemaRoom =
          cinemaRooms[Math.floor(Math.random() * cinemaRooms.length)]
        cs.seat = seats[Math.floor(Math.random() * seats.length)]
        cs.seatType = seatTypes[Math.floor(Math.random() * seatTypes.length)]
        return cs
      })
      .createMany(5)
    const userTickets = await factory(UserTicket)()
      .map(async (ut) => {
        ut.user = users[Math.floor(Math.random() * users.length)]
        ut.showtime = showtimes[Math.floor(Math.random() * showtimes.length)]
        return ut
      })
      .createMany(5)
    await factory(Ticket)()
      .map(async (ticket) => {
        ticket.userTicket =
          userTickets[Math.floor(Math.random() * userTickets.length)]
        ticket.cinemaSeat =
          cinemaSeats[Math.floor(Math.random() * cinemaSeats.length)]
        return ticket
      })
      .createMany(5)
  }
}
