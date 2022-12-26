import { NextFunction, Request, Response } from 'express'
import {
  CinemaRepository,
  ShowtimeRepository,
  MovieRepository,
  CinemaRoomRepository,
  TimeRepository,
} from '@repositories'
import { CinemaRoom } from '@entities'

export class ShowtimeManagementController {
  private cinemaRepository: CinemaRepository
  private showtimeRepository: ShowtimeRepository
  private movieRepository: MovieRepository
  private cinemaRoomRepository: CinemaRoomRepository
  private timeRepository: TimeRepository
  constructor() {
    this.cinemaRepository = new CinemaRepository()
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
      res.render('admin/showtime', {
        title: 'Showtimes management',
        layout: 'admin',
        showtimes,
      })
    } catch (error) {
      next(error)
    }
  }

  public getUpdateShowtimesView = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const showtime = await this.showtimeRepository.getShowtimeById(+id)
      const { roomId } = req.query
      const [cinemas, movies, time] = await Promise.all([
        this.cinemaRepository.getAllCinemas(),
        this.movieRepository.getAllMovie(),
        this.timeRepository.getAllShowtimes(),
        this.showtimeRepository.getShowtimeById(+id),
      ])
      let room: CinemaRoom
      let rooms = await this.cinemaRoomRepository.getAllCinemaRooms()

      if (roomId) {
        room = await this.cinemaRoomRepository.getRoomById(+roomId)
        rooms = await this.cinemaRoomRepository.getAllCinemaRooms()
      }
      res.render('admin/form-showtime', {
        title: 'Update showtime',
        layout: 'admin',
        cinemas,
        movies,
        room,
        rooms,
        time,
        showtime,
      })
    } catch (error) {
      next(error)
    }
  }

  public getAddShowtimesView = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { roomId } = req.query
      const [cinemas, movies, time] = await Promise.all([
        this.cinemaRepository.getAllCinemas(),
        this.movieRepository.getAllMovie(),
        this.timeRepository.getAllShowtimes(),
      ])
      let room: CinemaRoom
      let rooms = await this.cinemaRoomRepository.getAllCinemaRooms()

      if (roomId) {
        room = await this.cinemaRoomRepository.getRoomById(+roomId)
        rooms = await this.cinemaRoomRepository.getAllCinemaRooms()
      }
      res.render('admin/form-showtime', {
        title: 'Add showtime',
        layout: 'admin',
        cinemas,
        movies,
        room,
        rooms,
        time,
      })
    } catch (error) {
      next(error)
    }
  }
}
