import { Request, Response } from 'express'
import {
  CinemaRepository,
  CinemaRoomRepository,
  SeatRepository,
  SeatTypeRepository,
  CinemaSeatRepository,
} from '@repositories'
import { StatusCodes } from 'http-status-codes'

export class ApiAdminCinemaSeatsController {
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

  public getCinemaSeatsByRoomId = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { roomId } = req.query
      const cinemaSeats = await this.cinemaSeatRepository.getSeatsByRoomId(
        +roomId,
      )
      res.json(cinemaSeats)
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }

  public createCinemaSeat = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { cinemaRoomId, seatId, seatTypeId } = req.body
      const [cinemaRoom, seat, seatType] = await Promise.all([
        this.cinemaRoomRepository.getRoomById(+cinemaRoomId),
        this.seatRepository.getSeatById(+seatId),
        this.seatTypeRepository.getSeatTypeById(+seatTypeId),
      ])
      await this.cinemaSeatRepository.save(
        this.cinemaSeatRepository.create({ cinemaRoom, seat, seatType }),
      )
      res.json({ message: 'Create cinema seat success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }

  public updateCinemaSeat = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const { cinemaRoomId, seatId, seatTypeId } = req.body
      const [cinemaRoom, seat, seatType] = await Promise.all([
        this.cinemaRoomRepository.getRoomById(+cinemaRoomId),
        this.seatRepository.getSeatById(+seatId),
        this.seatTypeRepository.getSeatTypeById(+seatTypeId),
      ])
      await this.cinemaSeatRepository.save(
        this.cinemaSeatRepository.create({
          id: +id,
          cinemaRoom,
          seat,
          seatType,
        }),
      )
      res.json({ message: 'Update cinema seat success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }

  public deleteCinemaSeat = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params
      await this.cinemaSeatRepository.softDelete(+id)
      res.json({ message: 'Delete cinema seat success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }
}
