import { Router } from 'express'
import { ApiAdminCinemasController } from '@app/controllers'
import { adminRoleMiddleware, validationMiddleware } from '@app/middlewares'
import { CinemaDto } from '@dtos'

class ApiAdminiCinemasRoute {
  public path = '/api/admin/cinemas'
  public router = Router()

  private apiAdminCinemasController: ApiAdminCinemasController

  constructor() {
    this.apiAdminCinemasController = new ApiAdminCinemasController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(this.apiAdminCinemasController.getAllCinemas)
      .post(
        adminRoleMiddleware.isNotViewer,
        validationMiddleware(CinemaDto, 'body', true),
        this.apiAdminCinemasController.createCinema,
      )
    this.router
      .route('/:id(\\d+)')
      .put(
        adminRoleMiddleware.isNotViewer,
        validationMiddleware(CinemaDto, 'body', true),
        this.apiAdminCinemasController.updateCinema,
      )
      .delete(
        adminRoleMiddleware.isNotViewer,
        this.apiAdminCinemasController.deleteCinema,
      )
    this.router
      .route('/:id(\\d+)/rooms')
      .get(this.apiAdminCinemasController.getRoomOfCinema)
  }
}

export const apiAdminCinemasRoute = new ApiAdminiCinemasRoute()
