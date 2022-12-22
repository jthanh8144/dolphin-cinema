import { Router } from 'express'
import { AdminCinemasController } from '@app/controllers'
import { adminRoleMiddleware } from '@app/middlewares'

class AdminiCinemasRoute {
  public path = '/admin/cinemas'
  public router = Router()

  private adminCinemasController: AdminCinemasController

  constructor() {
    this.adminCinemasController = new AdminCinemasController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.route('/').get(this.adminCinemasController.getAllCinemas)
    this.router
      .route('/:id(\\d+)')
      .get(
        adminRoleMiddleware.isNotViewer,
        this.adminCinemasController.getUpdateCinemaView,
      )
    this.router
      .route('/:id(\\d+)/rooms')
      .get(this.adminCinemasController.getRoomOfCinema)
    this.router
      .route('/create')
      .get(
        adminRoleMiddleware.isNotViewer,
        this.adminCinemasController.getCreateCinemaView,
      )
  }
}

export const adminCinemasRoute = new AdminiCinemasRoute()
