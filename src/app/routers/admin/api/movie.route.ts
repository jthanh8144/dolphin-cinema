import { Router } from 'express'
import { ApiAdminMovieController } from '@app/controllers'
import { adminRoleMiddleware, validationMiddleware } from '@app/middlewares'
import { MovieDto } from '@dtos'

class ApiAdminMoviesRoute {
  public path = '/api/admin/movies'
  public router = Router()

  private apiAdminMovieController: ApiAdminMovieController

  constructor() {
    this.apiAdminMovieController = new ApiAdminMovieController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(this.apiAdminMovieController.getAllMovies)
      .post(
        adminRoleMiddleware.isNotViewer,
        validationMiddleware(MovieDto, 'body', true),
        this.apiAdminMovieController.createMovie,
      )
    this.router
      .route('/:id(\\d+)')
      .put(
        adminRoleMiddleware.isNotViewer,
        validationMiddleware(MovieDto, 'body', true),
        this.apiAdminMovieController.updateMovie,
      )
      .delete(
        adminRoleMiddleware.isNotViewer,
        this.apiAdminMovieController.deleteMovie,
      )
  }
}

export const apiAdminMoviesRoute = new ApiAdminMoviesRoute()
