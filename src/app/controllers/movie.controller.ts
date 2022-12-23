import { __ } from 'i18n'
import { NextFunction, Request, Response } from 'express'
import { MovieRepository } from '@repositories'
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

  public getMovies = (req: Request, res: Response) => {
    res.render('movies', { title: __('Movies') })
  }

  public searchMovies = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const type = Object.keys(req.query)[0]
      const value = Object.values(req.query)[0].toString()
      if (!type) {
        return next(createHttpError(404))
      }
      if (!['all', 'name', 'writer', 'director'].includes(type)) {
        res.render('search', { message: 'Type search is error' })
      }
      const search = await this.movieRepository.getSearchResult(type, value)
      const { countPage, totalItem } = await this.movieRepository.countPages(
        type,
        value,
      )

      res.render('search', {
        title: 'search page',
        search,
        isHasLoadMore: countPage > 1,
        totalItem,
      })
    } catch (error) {
      next(error)
    }
  }
}
