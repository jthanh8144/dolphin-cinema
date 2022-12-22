import { Router } from 'express'
import { ApiUsersController } from '@app/controllers'
import { validationMiddleware, loginMiddleware } from '@middlewares'
import { FindUserByEmailDto } from '@dtos'

class ApiUsersRoute {
  public path = '/api/users'
  public router = Router()

  private apiUsersController: ApiUsersController

  constructor() {
    this.apiUsersController = new ApiUsersController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/search')
      .post(
        validationMiddleware(FindUserByEmailDto, 'body'),
        this.apiUsersController.getUserByEmail,
      )

    this.router
      .route('/profiles')
      .put(loginMiddleware.isLogged, this.apiUsersController.updateProfile)

    this.router
      .route('/password')
      .put(loginMiddleware.isLogged, this.apiUsersController.updatePassword)

    this.router
      .route('/reset-password')
      .post(
        validationMiddleware(FindUserByEmailDto, 'body'),
        this.apiUsersController.sendEmailResetPassword,
      )
  }
}

export const apiUsersRoute = new ApiUsersRoute()
