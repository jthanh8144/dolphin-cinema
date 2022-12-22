import { Router } from 'express'
import { HomeAdminController } from '@app/controllers'
import { adminAuthMiddleware } from '@middlewares'

class HomeAdminRoute {
  public path = '/admin'
  public router = Router()

  private homeAdminController: HomeAdminController

  constructor() {
    this.homeAdminController = new HomeAdminController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(adminAuthMiddleware.isAdmin, this.homeAdminController.homeAdmin)
    this.router
      .route('/login')
      .get(this.homeAdminController.getLoginAdmin)
      .post(this.homeAdminController.loginAdmin)
    this.router
      .route('/logout')
      .get(adminAuthMiddleware.isAdmin, this.homeAdminController.logoutAdmin)
    this.router
      .route('/default-password')
      .get(
        adminAuthMiddleware.isAdmin,
        this.homeAdminController.checkDefaultPassword,
      )
  }
}

export const homeAdminRoute = new HomeAdminRoute()
