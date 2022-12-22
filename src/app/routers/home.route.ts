import { Router } from 'express'
import { HomeController } from '@app/controllers'
import { fileUploadMiddleware, multerUploadMiddleware } from '@middlewares'

class HomeRoute {
  public path = '/'
  public router = Router()

  private homeController: HomeController

  constructor() {
    this.homeController = new HomeController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.route('/').get(this.homeController.home)
    this.router.route('/login').post(this.homeController.login)
    this.router.route('/logout').get(this.homeController.logout)
    this.router.route('/lang').get(this.homeController.configLanguage)
    this.router
      .route('/upload')
      .post(
        multerUploadMiddleware,
        fileUploadMiddleware,
        this.homeController.upload,
      )
  }
}

export const homeRoute = new HomeRoute()
