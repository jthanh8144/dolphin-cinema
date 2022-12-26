import { NextFunction, Request, Response } from 'express'
import {
  ShowtimeRepository,
  MovieRepository,
  CinemaRoomRepository,
  TimeRepository,
} from '@repositories'
import { StatusCodes } from 'http-status-codes'

export class ApiAdminShowtimesController {
  private showtimeRepository: ShowtimeRepository
  private movieRepository: MovieRepository
  private cinemaRoomRepository: CinemaRoomRepository
  private timeRepository: TimeRepository

  constructor() {
    this.showtimeRepository = new ShowtimeRepository()
    this.movieRepository = new MovieRepository()
    this.cinemaRoomRepository = new CinemaRoomRepository()
    this.timeRepository = new TimeRepository()
  }

  public getAllShowtimes = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const { locationId, date, cinemaId } = req.body
      const showtimes = await this.showtimeRepository.getShowtimesMovie({
        movieId: id,
        locationId,
        date,
        cinemaId,
      })
      res.json(showtimes)
    } catch (error) {
      next(error)
    }
  }
  public createShowtimes = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { showDate, cinemaRoomId, timeId, movieId } = req.body
      const [cinemaRoom, time, movie] = await Promise.all([
        this.cinemaRoomRepository.getRoomById(+cinemaRoomId),
        this.timeRepository.getTimeById(+timeId),
        this.movieRepository.getMovieById(+movieId),
      ])
      await this.showtimeRepository.save(
        this.showtimeRepository.create({ showDate, cinemaRoom, time, movie }),
      )
      res.json({ message: 'Create showtimes success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }

  public updateShowtimes = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const { showDate, cinemaRoomId, timeId, movieId } = req.body
      const [cinemaRoom, time, movie] = await Promise.all([
        this.cinemaRoomRepository.getRoomById(+cinemaRoomId),
        this.timeRepository.getTimeById(+timeId),
        this.movieRepository.getMovieById(+movieId),
      ])
      await this.showtimeRepository.save(
        this.showtimeRepository.create({
          id: +id,
          showDate,
          cinemaRoom,
          time,
          movie,
        }),
      )
      res.json({ message: 'Update showtimes success!' })
    } catch (error) {
      console.log(error)

      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }
  public deleteShowtimes = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params
      await this.showtimeRepository.softDelete(+id)
      res.json({ message: 'Delete showtimes success!' })
    } catch (error) {
      console.log(error)

      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }
}
