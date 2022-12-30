import { Router } from 'express'
import { AdminsController } from '@app/controllers'
import {
  adminAuthMiddleware,
  multerUploadMiddleware,
  fileUploadMiddleware,
} from '@middlewares'

class AdminsRoute {
  public path = '/admin'
  public router = Router()

  private adminsController: AdminsController

  constructor() {
    this.adminsController = new AdminsController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/profile')
      .get(adminAuthMiddleware.isAdmin, this.adminsController.getProfile)
    this.router
      .route('/upload-avatar')
      .post(
        adminAuthMiddleware.isAdmin,
        multerUploadMiddleware,
        fileUploadMiddleware,
        this.adminsController.uploadAvatar,
      )
  }
}

export const adminsRoute = new AdminsRoute()
