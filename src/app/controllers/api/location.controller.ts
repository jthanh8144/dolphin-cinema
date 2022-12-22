import { NextFunction, Request, Response } from 'express'
import { LocationRepository } from '@repositories'

export class ApiLocationsController {
  private locationRepository: LocationRepository

  constructor() {
    this.locationRepository = new LocationRepository()
  }

  public getAllLocations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const locations = await this.locationRepository.getAllLocations()
      res.json(locations)
    } catch (error) {
      next(error)
    }
  }
}
