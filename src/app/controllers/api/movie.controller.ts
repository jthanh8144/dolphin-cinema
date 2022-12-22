import { NextFunction, Request, Response } from 'express'
import { CinemaRepository, MovieRepository } from '@repositories'

export class ApiMoviesController {
  private cinemaRepository: CinemaRepository
  private movieRepository: MovieRepository

  constructor() {
    this.cinemaRepository = new CinemaRepository()
    this.movieRepository = new MovieRepository()
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
}
