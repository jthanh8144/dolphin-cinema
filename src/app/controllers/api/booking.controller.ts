import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { bookingService } from '@app/services'

export class ApiBookingController {
  public bookTickets = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user } = res.locals
      const { cinemaSeatsId, showtimeId } = req.body

      // save booking
      const userTicket = await bookingService.saveBooking(
        user,
        cinemaSeatsId,
        showtimeId,
      )
      // response
      res.json({ message: 'Booking success', userTicketId: userTicket.id })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Booking fail. Please try again later!' })
    }
  }
}
