import { Router } from 'express'
import { ApiMoviesController } from '@app/controllers'

class ApiMoviesRoute {
  public path = '/api/movies'
  public router = Router()

  private apiMoviesController: ApiMoviesController

  constructor() {
    this.apiMoviesController = new ApiMoviesController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.route('/:id').get(this.apiMoviesController.getMovieById)
    this.router
      .route('/:id/showtimes')
      .post(this.apiMoviesController.getShowTimes)
  }
}

export const apiMoviesRoute = new ApiMoviesRoute()
