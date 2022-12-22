import { Router } from 'express'
import { AdminCinemaSeatsController } from '@app/controllers'
import { adminRoleMiddleware } from '@app/middlewares'

class AdminiCinemaSeatsRoute {
  public path = '/admin/cinema-seats'
  public router = Router()

  private adminCinemaSeatsController: AdminCinemaSeatsController

  constructor() {
    this.adminCinemaSeatsController = new AdminCinemaSeatsController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/create')
      .get(
        adminRoleMiddleware.isNotViewer,
        this.adminCinemaSeatsController.getCreateCinemaSeatView,
      )
    this.router
      .route('/:id(\\d+)')
      .get(this.adminCinemaSeatsController.getUpdateCinemaSeatView)
  }
}

export const adminCinemaSeatsRoute = new AdminiCinemaSeatsRoute()
