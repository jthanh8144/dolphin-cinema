import { NextFunction, Request, Response } from 'express'
import {
  CinemaRepository,
  CinemaRoomRepository,
  SeatRepository,
  SeatTypeRepository,
  CinemaSeatRepository,
} from '@repositories'
import { CinemaRoom } from '@entities'

export class AdminCinemaSeatsController {
  private cinemaRepository: CinemaRepository
  private cinemaRoomRepository: CinemaRoomRepository
  private seatRepository: SeatRepository
  private seatTypeRepository: SeatTypeRepository
  private cinemaSeatRepository: CinemaSeatRepository

  constructor() {
    this.cinemaRepository = new CinemaRepository()
    this.cinemaRoomRepository = new CinemaRoomRepository()
    this.seatRepository = new SeatRepository()
    this.seatTypeRepository = new SeatTypeRepository()
    this.cinemaSeatRepository = new CinemaSeatRepository()
  }

  public getCreateCinemaSeatView = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { role } = res.locals
      const { roomId } = req.query
      const [cinemas, seats, seatTypes] = await Promise.all([
        this.cinemaRepository.getAllCinemas(),
        this.seatRepository.getAllSeats(),
        this.seatTypeRepository.getAllSeatTypes(),
      ])
      let room: CinemaRoom
      let rooms = await this.cinemaRoomRepository.getRoomsByCinemaId(
        cinemas[0].id,
      )
      if (roomId) {
        room = await this.cinemaRoomRepository.getRoomById(+roomId)
        rooms = await this.cinemaRoomRepository.getRoomsByCinemaId(
          room.cinema.id,
        )
      }
      res.render('admin/form-cinema-seat', {
        title: 'Cinema management',
        layout: 'admin',
        role,
        cinemas,
        room,
        rooms,
        seats,
        seatTypes,
      })
    } catch (error) {
      next(error)
    }
  }

  public getUpdateCinemaSeatView = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { role } = res.locals
      const { id } = req.params
      const [cinemas, seats, seatTypes, seat] = await Promise.all([
        this.cinemaRepository.getAllCinemas(),
        this.seatRepository.getAllSeats(),
        this.seatTypeRepository.getAllSeatTypes(),
        this.cinemaSeatRepository.getSeatById(+id),
      ])
      const rooms = await this.cinemaRoomRepository.getRoomsByCinemaId(
        seat.cinemaRoom.cinema.id,
      )
      res.render('admin/form-cinema-seat', {
        title: 'Cinema management',
        layout: 'admin',
        role,
        cinemas,
        rooms,
        seats,
        seatTypes,
        seat,
      })
    } catch (error) {
      next(error)
    }
  }
}
