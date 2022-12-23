import createHttpError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import {
  CinemaRepository,
  MovieRepository,
  CommentRepository,
} from '@repositories'

export class ApiMoviesController {
  private cinemaRepository: CinemaRepository
  private movieRepository: MovieRepository
  private commentRepository: CommentRepository

  constructor() {
    this.cinemaRepository = new CinemaRepository()
    this.movieRepository = new MovieRepository()
    this.commentRepository = new CommentRepository()
  }

  public getShowTimes = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const { locationId, date, cinemaId } = req.body
      const showtimes = await this.cinemaRepository.getShowtimesOfMovie({
        movieId: id,
        locationId,
        date,
        cinemaId,
      })

      res.json({ showtimes })
    } catch (error) {
      next(error)
    }
  }

  public getMovieById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const movie = await this.movieRepository.getMovieById(+id)
      res.json({ ...movie })
    } catch (error) {
      next(error)
    }
  }

  public getAllCommentOfMovieById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movieId = +req.params.id
      const page = +req.query.page < 1 ? 0 : +req.query.page
      const movie = await this.movieRepository.findOne({
        where: { id: movieId },
      })
      if (!movie || !page) {
        return next(createHttpError(404, 'Not Found'))
      }
      const findAllCommentDataByMovieId =
        await this.commentRepository.getAllCommentByMovieId(movieId, page)
      res.json({ data: findAllCommentDataByMovieId })
    } catch (error) {
      next(error)
    }
  }

  public getAllCommentAndRatingOfMovieById = async (
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
      const allCommentAndRatingOfMovie =
        await this.movieRepository.getTotalCommentAndRatingOfMovieById(movieId)
      res.json({ data: allCommentAndRatingOfMovie })
    } catch (error) {
      next(error)
    }
  }
}
