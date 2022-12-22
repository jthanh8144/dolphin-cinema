import { NextFunction, Request, Response } from 'express'
import { CinemaSeatRepository, CinemaRoomRepository } from '@repositories'

export class AdminCinemaRoomsController {
  private cinemaSeatRepository: CinemaSeatRepository
  private cinemaRoomRepository: CinemaRoomRepository

  constructor() {
    this.cinemaSeatRepository = new CinemaSeatRepository()
    this.cinemaRoomRepository = new CinemaRoomRepository()
  }

  public getSeatsOfRoom = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const [seats, room] = await Promise.all([
        this.cinemaSeatRepository.getSeatsByRoomId(+id),
        this.cinemaRoomRepository.getRoomById(+id),
      ])
      res.render('admin/cinema-seat', {
        title: 'Seats of the room',
        layout: 'admin',
        seats,
        room,
      })
    } catch (error) {
      next(error)
    }
  }
}
