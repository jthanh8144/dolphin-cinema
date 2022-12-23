import { Router } from 'express'
import { MovieController } from '@controllers/movie.controller'

class MoviesRoute {
  public path = '/movies'
  public router = Router()

  private movieController: MovieController

  constructor() {
    this.movieController = new MovieController()
    this.initializeRoutes()
  }
  private initializeRoutes() {
    this.router.route('/search').get(this.movieController.searchMovies)
    this.router.route('/:id(\\d+)').get(this.movieController.getMovieById)
    this.router.route('/').get(this.movieController.getMovies)
  }
}

export const moviesRoute = new MoviesRoute()
