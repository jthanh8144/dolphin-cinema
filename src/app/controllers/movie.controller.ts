import { NextFunction, Request, Response } from 'express'
import { MovieRepository } from '@repositories/movie.repository'
import createHttpError from 'http-errors'
import { dateFormat } from '@shared/constants'
export class MovieController {
  private movieRepository: MovieRepository

  constructor() {
    this.movieRepository = new MovieRepository()
  }

  public getMovieById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movieId = +req.params.id
      const movie = await this.movieRepository.findOne({
        where: { id: movieId },
      })
      if (!movie) {
        return next(createHttpError(404, 'Not Found'))
      }
      const findOneMovieData = await this.movieRepository.getDetailMovieData(
        movieId,
      )
      res.render('movie-details', {
        data: findOneMovieData,
        title: `Movie | ${findOneMovieData.name}`,
        dateOnlyFormat: dateFormat.dateOnlyFormat,
        displayDateFormat: dateFormat.displayDateFormat,
      })
    } catch (error) {
      next(error)
    }
  }
}
