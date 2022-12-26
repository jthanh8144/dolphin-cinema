import { Router } from 'express'
import { MovieManagementController } from '@app/controllers'
import { adminRoleMiddleware } from '@app/middlewares'

class MovieManagementRoute {
  public path = '/admin/movies'
  public router = Router()

  private movieManagementController: MovieManagementController

  constructor() {
    this.movieManagementController = new MovieManagementController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.route('/').get(this.movieManagementController.getListMovies)
    this.router
      .route('/:id(\\d+)')
      .get(
        adminRoleMiddleware.isNotViewer,
        this.movieManagementController.getUpdateMovieView,
      )
    this.router
      .route('/add')
      .get(
        adminRoleMiddleware.isNotViewer,
        this.movieManagementController.getAddMovieView,
      )
  }
}

export const movieManagementRoute = new MovieManagementRoute()
