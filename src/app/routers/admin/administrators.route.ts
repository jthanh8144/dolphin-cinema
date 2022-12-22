import { Router } from 'express'
import { AdministratorsController } from '@app/controllers'
import { adminRoleMiddleware } from '@app/middlewares'

class AdministratorsRoute {
  public path = '/admin/administrators'
  public router = Router()

  private administratorsController: AdministratorsController

  constructor() {
    this.administratorsController = new AdministratorsController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(
        adminRoleMiddleware.isAdmin,
        this.administratorsController.getListAdminUsers,
      )
    this.router
      .route('/:id(\\d+)')
      .get(
        adminRoleMiddleware.isAdmin,
        this.administratorsController.getAdminById,
      )
    this.router
      .route('/form')
      .get(
        adminRoleMiddleware.isAdmin,
        this.administratorsController.getAddAdminUsersView,
      )
  }
}

export const administratorsRoute = new AdministratorsRoute()
