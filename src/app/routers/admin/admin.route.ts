import { Router } from 'express'
import { AdminsController } from '@app/controllers'

class AdminsRoute {
  public path = '/admin'
  public router = Router()

  private adminsController: AdminsController

  constructor() {
    this.adminsController = new AdminsController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.route('/profile').get(this.adminsController.getProfile)
  }
}

export const adminsRoute = new AdminsRoute()
