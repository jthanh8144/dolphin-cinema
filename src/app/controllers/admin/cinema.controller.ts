import { NextFunction, Request, Response } from 'express'
import {
  CinemaRepository,
  LocationRepository,
  CinemaRoomRepository,
} from '@repositories'

export class AdminCinemasController {
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
      res.render('admin/cinema', {
        title: 'Cinema management',
        layout: 'admin',
        cinemas,
      })
    } catch (error) {
      next(error)
    }
  }

  public getCreateCinemaView = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { role } = res.locals
      const locations = await this.locationRepository.getAllLocations()
      res.render('admin/form-cinema', {
        title: 'Cinema management',
        layout: 'admin',
        role,
        locations,
      })
    } catch (error) {
      next(error)
    }
  }

  public getUpdateCinemaView = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { role } = res.locals
      const { id } = req.params
      const [cinema, locations] = await Promise.all([
        this.cinemaRepository.getCinemaById(+id),
        this.locationRepository.getAllLocations(),
      ])
      res.render('admin/form-cinema', {
        title: 'Cinema management',
        layout: 'admin',
        role,
        cinema,
        locations,
      })
    } catch (error) {
      next(error)
    }
  }

  public getRoomOfCinema = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { role } = res.locals
      const { id } = req.params
      const [rooms, cinema] = await Promise.all([
        this.cinemaRoomRepository.getRoomsByCinemaId(+id),
        this.cinemaRepository.getCinemaById(+id),
      ])
      res.render('admin/cinema-room', {
        title: 'Room of cinema',
        layout: 'admin',
        role,
        rooms,
        cinema,
      })
    } catch (error) {
      next(error)
    }
  }
}
