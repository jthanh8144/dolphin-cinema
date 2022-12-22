import { Router } from 'express'
import { ApiAdminUsersController } from '@app/controllers'
import { adminRoleMiddleware } from '@app/middlewares'

class ApiUsersRoute {
  public path = '/api/admin/users'
  public router = Router()

  private adminUsersController: ApiAdminUsersController

  constructor() {
    this.adminUsersController = new ApiAdminUsersController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.route('/').get(this.adminUsersController.getListUsers)
    this.router
      .route('/:id(\\d+)')
      .post(
        adminRoleMiddleware.isNotViewer,
        this.adminUsersController.updateStatus,
      )
      .put(
        adminRoleMiddleware.isNotViewer,
        this.adminUsersController.updatePassword,
      )
      .delete(
        adminRoleMiddleware.isNotViewer,
        this.adminUsersController.deleteUser,
      )
  }
}

export const apiUserssRoute = new ApiUsersRoute()
