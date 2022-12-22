import { Router } from 'express'
import { ApiBookingController } from '@app/controllers'
import { loginMiddleware } from '@middlewares'

class ApiBookingRoute {
  public path = '/api/booking'
  public router = Router()

  private apiBookingController: ApiBookingController

  constructor() {
    this.apiBookingController = new ApiBookingController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .post(loginMiddleware.isLogged, this.apiBookingController.bookTickets)
  }
}

export const apiBookingRoute = new ApiBookingRoute()
