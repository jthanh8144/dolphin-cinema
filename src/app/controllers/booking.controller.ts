import { NextFunction, Request, Response } from 'express'
import {
  ShowtimeRepository,
  SeatRepository,
  UserTicketRepository,
} from '@repositories'

export class BookingController {
  private showtimeRepository: ShowtimeRepository
  private seatRepository: SeatRepository
  private userTicketRepository: UserTicketRepository

  constructor() {
    this.showtimeRepository = new ShowtimeRepository()
    this.seatRepository = new SeatRepository()
    this.userTicketRepository = new UserTicketRepository()
  }

  public getChooseSeatView = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { user } = res.locals
      const { showtimeId } = req.body
      const showtime = await this.showtimeRepository.getShowtimeById(
        +showtimeId,
      )
      const seats = await this.seatRepository.getAllSeatsByShowtimeId(
        +showtimeId,
      )
      res.render('booking-ticket', {
        title: 'Booking ticket',
        username: user?.fullName,
        row: Object.keys(seats),
        seats: Object.values(seats),
        showtime,
      })
    } catch (error) {
      next(error)
    }
  }

  public bookingSuccess = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { user } = res.locals
      const { id } = req.query
      const userTicket = await this.userTicketRepository.getUserTicketById(+id)
      if (userTicket.user.id !== user.id) {
        return res.redirect('/')
      }
      res.render('booking-success', {
        title: 'Booking success',
        username: user?.fullName,
        userTicket,
      })
    } catch (error) {
      res.render('404', { title: 'Page Not found' })
    }
  }
}
