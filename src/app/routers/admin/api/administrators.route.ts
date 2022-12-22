import { Router } from 'express'
import { ApiAdministratorsController } from '@app/controllers'
import { adminRoleMiddleware } from '@app/middlewares'

class ApiAdministratorsRoute {
  public path = '/api/admin/administrators'
  public router = Router()

  private administratorsController: ApiAdministratorsController

  constructor() {
    this.administratorsController = new ApiAdministratorsController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(
        adminRoleMiddleware.isAdmin,
        this.administratorsController.getListAdminUsers,
      )
      .post(
        adminRoleMiddleware.isAdmin,
        this.administratorsController.addAdminUser,
      )
    this.router
      .route('/:id(\\d+)')
      .post(
        adminRoleMiddleware.isAdmin,
        this.administratorsController.resetPassword,
      )
      .put(
        adminRoleMiddleware.isAdmin,
        this.administratorsController.updateAdminUser,
      )
      .delete(
        adminRoleMiddleware.isAdmin,
        this.administratorsController.deleteAdminUser,
      )
    this.router
      .route('/search')
      .post(
        adminRoleMiddleware.isAdmin,
        this.administratorsController.getAdminByEmail,
      )
  }
}

export const apiAdministratorsRoute = new ApiAdministratorsRoute()
