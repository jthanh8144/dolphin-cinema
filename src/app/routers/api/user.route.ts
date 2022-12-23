import { Router } from 'express'
import { ApiUsersController } from '@app/controllers'
import { validationMiddleware, loginMiddleware } from '@middlewares'
import {
  FindUserByEmailDto,
  CreateUserRatingDto,
  CreateCommentDto,
  UpdateCommentDto,
} from '@dtos'

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

    this.router
      .route('/ratings')
      .post(
        loginMiddleware.isLogged,
        validationMiddleware(CreateUserRatingDto, 'body', true),
        this.apiUsersController.ratingMovie,
      )
    this.router
      .route('/ratings/:id(\\d+)')
      .get(this.apiUsersController.getUserRatingOfMovie)
    this.router
      .route('/comments')
      .post(
        loginMiddleware.isLogged,
        validationMiddleware(CreateCommentDto, 'body', true),
        this.apiUsersController.createComment,
      )
    this.router
      .route('/comments/:id(\\d+)')
      .get(
        loginMiddleware.isLogged,
        this.apiUsersController.getCommentOfUserById,
      )
      .put(
        loginMiddleware.isLogged,
        validationMiddleware(UpdateCommentDto, 'body', true),
        this.apiUsersController.updateCommentOfUserById,
      )
      .delete(loginMiddleware.isLogged, this.apiUsersController.deleteComment)
  }
}

export const apiUsersRoute = new ApiUsersRoute()
