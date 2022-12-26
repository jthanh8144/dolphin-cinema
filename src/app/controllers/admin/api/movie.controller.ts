import { NextFunction, Request, Response } from 'express'
import { MovieRepository } from '@repositories'
import { MovieDto } from '@dtos'
import { StatusCodes } from 'http-status-codes'
import { plainToInstance } from 'class-transformer'

export class ApiAdminMovieController {
  private movieRepository: MovieRepository

  constructor() {
    this.movieRepository = new MovieRepository()
  }

  public getAllMovies = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movies = await this.movieRepository.getAllMovie()
      res.json(movies)
    } catch (error) {
      next(error)
    }
  }

  public createMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const movieData = plainToInstance(MovieDto, req.body)
      await this.movieRepository.save(
        this.movieRepository.create({ ...movieData }),
      )
      res.json({ message: 'Create movie success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }

  public updateMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const movieData = plainToInstance(MovieDto, req.body)
      await this.movieRepository.save(
        this.movieRepository.create({ ...movieData }),
      )
      res.json({ message: 'update movie success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }

  public deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      await this.movieRepository.softDelete(+id)
      res.json({ message: 'Delete movie success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }
}
