import { Router } from 'express'
import { AdminCinemaRoomsController } from '@app/controllers'
// import { adminRoleMiddleware } from '@app/middlewares'

class AdminiCinemaRoomsRoute {
  public path = '/admin/cinema-rooms'
  public router = Router()

  private adminCinemaRoomsController: AdminCinemaRoomsController

  constructor() {
    this.adminCinemaRoomsController = new AdminCinemaRoomsController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/:id(\\d+)/seats')
      .get(this.adminCinemaRoomsController.getSeatsOfRoom)
  }
}

export const adminCinemaRoomsRoute = new AdminiCinemaRoomsRoute()
