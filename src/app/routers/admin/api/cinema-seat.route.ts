import { Router } from 'express'
import { ApiAdminCinemaSeatsController } from '@app/controllers'
import { adminRoleMiddleware, validationMiddleware } from '@app/middlewares'
import { CinemaSeatDto } from '@dtos'

class ApiAdminiCinemaSeatsRoute {
  public path = '/api/admin/cinema-seats'
  public router = Router()

  private apiAdminCinemaSeatsController: ApiAdminCinemaSeatsController

  constructor() {
    this.apiAdminCinemaSeatsController = new ApiAdminCinemaSeatsController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(this.apiAdminCinemaSeatsController.getCinemaSeatsByRoomId)
      .post(
        adminRoleMiddleware.isNotViewer,
        validationMiddleware(CinemaSeatDto, 'body', true),
        this.apiAdminCinemaSeatsController.createCinemaSeat,
      )
    this.router
      .route('/:id(\\d+)')
      .put(
        adminRoleMiddleware.isNotViewer,
        validationMiddleware(CinemaSeatDto, 'body', true),
        this.apiAdminCinemaSeatsController.updateCinemaSeat,
      )
      .delete(
        adminRoleMiddleware.isNotViewer,
        this.apiAdminCinemaSeatsController.deleteCinemaSeat,
      )
  }
}

export const apiAdminCinemaSeatsRoute = new ApiAdminiCinemaSeatsRoute()
