import { NextFunction, Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import {
  CinemaRepository,
  LocationRepository,
  CinemaRoomRepository,
} from '@repositories'
import { CinemaDto } from '@dtos'
import { StatusCodes } from 'http-status-codes'

export class ApiAdminCinemasController {
  private cinemaRepository: CinemaRepository
  private locationRepository: LocationRepository
  private cinemaRoomRepository: CinemaRoomRepository

  constructor() {
    this.cinemaRepository = new CinemaRepository()
    this.locationRepository = new LocationRepository()
    this.cinemaRoomRepository = new CinemaRoomRepository()
  }

  public getAllCinemas = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const cinemas = await this.cinemaRepository.getAllCinemasWithRelation()
      res.json(cinemas)
    } catch (error) {
      next(error)
    }
  }

  public createCinema = async (req: Request, res: Response): Promise<void> => {
    try {
      const cinemaData = plainToInstance(CinemaDto, req.body)
      const location = await this.locationRepository.getLocationById(
        cinemaData.locationId,
      )
      delete cinemaData.locationId
      await this.cinemaRepository.save(
        this.cinemaRepository.create({ ...cinemaData, location }),
      )
      res.json({ message: 'Create cinema success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }

  public updateCinema = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const cinemaData = plainToInstance(CinemaDto, req.body)
      const location = await this.locationRepository.getLocationById(
        cinemaData.locationId,
      )
      delete cinemaData.locationId
      await this.cinemaRepository.save(
        this.cinemaRepository.create({ id: +id, ...cinemaData, location }),
      )
      res.json({ message: 'Update cinema success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }

  public deleteCinema = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      await this.cinemaRepository.softDelete(+id)
      res.json({ message: 'Delete cinema success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }

  public getRoomOfCinema = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const rooms = await this.cinemaRoomRepository.getRoomsByCinemaId(+id)
      res.json(rooms)
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }
}
