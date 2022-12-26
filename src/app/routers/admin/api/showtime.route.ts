import { Router } from 'express'
import { ApiAdminShowtimesController } from '@app/controllers'
import { adminRoleMiddleware, validationMiddleware } from '@app/middlewares'
import { ShowtimesDto } from '@dtos'

class ApiAdminShowtimesRoute {
  public path = '/api/admin/showtimes'
  public router = Router()

  private apiAdminShowtimesController: ApiAdminShowtimesController

  constructor() {
    this.apiAdminShowtimesController = new ApiAdminShowtimesController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(this.apiAdminShowtimesController.getAllShowtimes)
      .post(
        adminRoleMiddleware.isNotViewer,
        validationMiddleware(ShowtimesDto, 'body', true),
        this.apiAdminShowtimesController.createShowtimes,
      )
    this.router
      .route('/:id(\\d+)')
      .put(
        adminRoleMiddleware.isNotViewer,
        validationMiddleware(ShowtimesDto, 'body', true),
        this.apiAdminShowtimesController.updateShowtimes,
      )
      .delete(
        adminRoleMiddleware.isNotViewer,
        this.apiAdminShowtimesController.deleteShowtimes,
      )
  }
}

export const apiAdminShowtimesRoute = new ApiAdminShowtimesRoute()
