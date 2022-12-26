import { Router } from 'express'
import { ShowtimeManagementController } from '@app/controllers'
import { adminRoleMiddleware } from '@app/middlewares'

class ShowtimesRoute {
  public path = '/admin/showtimes'
  public router = Router()

  private showtimeManagementController: ShowtimeManagementController

  constructor() {
    this.showtimeManagementController = new ShowtimeManagementController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(this.showtimeManagementController.getAllShowtimes)
    this.router
      .route('/:id(\\d+)')
      .get(
        adminRoleMiddleware.isNotViewer,
        this.showtimeManagementController.getUpdateShowtimesView,
      )
    this.router
      .route('/add')
      .get(
        adminRoleMiddleware.isNotViewer,
        this.showtimeManagementController.getAddShowtimesView,
      )
  }
}

export const showtimesRoute = new ShowtimesRoute()
