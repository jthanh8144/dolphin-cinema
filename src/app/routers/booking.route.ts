import { Router } from 'express'
import { BookingController } from '@app/controllers'
import { loginMiddleware } from '@middlewares'

class BookingRoute {
  public path = '/booking'
  public router = Router()

  private bookingController: BookingController

  constructor() {
    this.bookingController = new BookingController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(loginMiddleware.isLogged, this.bookingController.bookingSuccess)
      .post(loginMiddleware.isLogged, this.bookingController.getChooseSeatView)
  }
}

export const bookingRoute = new BookingRoute()
