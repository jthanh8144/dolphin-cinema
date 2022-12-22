import { Router } from 'express'
import { ApiAdminsController } from '@app/controllers'
import { validationMiddleware } from '@middlewares'
import { UpdateAdminDto, UpdateAdminPasswordDto } from '@dtos'

class ApiAdminsRoute {
  public path = '/api/admin'
  public router = Router()

  private apiAdminsController: ApiAdminsController

  constructor() {
    this.apiAdminsController = new ApiAdminsController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/profile')
      .put(
        validationMiddleware(UpdateAdminDto, 'body', true),
        this.apiAdminsController.updateProfile,
      )
    this.router
      .route('/profile/password')
      .put(
        validationMiddleware(UpdateAdminPasswordDto, 'body', true),
        this.apiAdminsController.updatePassword,
      )
  }
}

export const apiAdminsRoute = new ApiAdminsRoute()
