import { Router } from 'express'
import { UsersController } from '@app/controllers/user.controller'
import {
  validationMiddleware,
  loginMiddleware,
  multerUploadMiddleware,
  fileUploadMiddleware,
} from '@middlewares'
import { UpdateUserDto } from '@dtos'

class UsersRoute {
  public path = '/users'
  public router = Router()

  private usersController: UsersController

  constructor() {
    this.usersController = new UsersController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(loginMiddleware.isLogged, this.usersController.getUserProfile)

    this.router
      .route('/:id(\\d+)')
      .get(this.usersController.getUserById)
      .put(
        validationMiddleware(UpdateUserDto, 'body', true),
        this.usersController.updateUser,
      )
      .delete(this.usersController.deleteUser)

    this.router
      .route('/upload-avatar')
      .post(
        loginMiddleware.isLogged,
        multerUploadMiddleware,
        fileUploadMiddleware,
        this.usersController.uploadAvatar,
      )
  }
}

export const usersRoute = new UsersRoute()
