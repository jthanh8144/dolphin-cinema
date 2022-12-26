import { NextFunction, Request, Response } from 'express'
import { MovieRepository } from '@repositories'

export class MovieManagementController {
  private movieRepository: MovieRepository

  constructor() {
    this.movieRepository = new MovieRepository()
  }

  public getListMovies = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movies = await this.movieRepository.getAllMovie()
      res.render('admin/movie', {
        title: 'Movie management',
        layout: 'admin',
        movies,
      })
    } catch (error) {
      next(error)
    }
  }

  public getAddMovieView = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      res.render('admin/form-movie', {
        title: 'Add movie',
        layout: 'admin',
      })
    } catch (error) {
      next(error)
    }
  }

  public getUpdateMovieView = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const movie = await this.movieRepository.getMovieById(+id)
      res.render('admin/form-movie', {
        title: 'Update movie',
        layout: 'admin',
        movie,
      })
    } catch (error) {
      next(error)
    }
  }
}
