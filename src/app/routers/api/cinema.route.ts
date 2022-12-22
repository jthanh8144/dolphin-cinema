import { Router } from 'express'
import { ApiCinemasController } from '@app/controllers'

class ApiCinemasRoute {
  public path = '/api/cinemas'
  public router = Router()

  private apiCinemasController: ApiCinemasController

  constructor() {
    this.apiCinemasController = new ApiCinemasController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.route('/').get(this.apiCinemasController.getAllCinemas)
  }
}

export const apiCinemasRoute = new ApiCinemasRoute()
