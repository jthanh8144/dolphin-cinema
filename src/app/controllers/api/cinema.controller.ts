import { NextFunction, Request, Response } from 'express'
import { CinemaRepository } from '@repositories'

export class ApiCinemasController {
  private cinemaRepository: CinemaRepository

  constructor() {
    this.cinemaRepository = new CinemaRepository()
  }

  public getAllCinemas = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const cinemas = await this.cinemaRepository.getAllCinemas()
      res.json(cinemas)
    } catch (error) {
      next(error)
    }
  }
}
