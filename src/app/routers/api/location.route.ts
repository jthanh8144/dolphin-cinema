import { Router } from 'express'
import { ApiLocationsController } from '@app/controllers'

class ApiLocationsRoute {
  public path = '/api/locations'
  public router = Router()

  private apiLocationsController: ApiLocationsController

  constructor() {
    this.apiLocationsController = new ApiLocationsController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.route('/').get(this.apiLocationsController.getAllLocations)
  }
}

export const apiLocationsRoute = new ApiLocationsRoute()
