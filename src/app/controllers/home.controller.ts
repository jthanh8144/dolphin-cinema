import { __ } from 'i18n'
import { validate } from 'class-validator'
import { StatusCodes } from 'http-status-codes'
import { plainToInstance } from 'class-transformer'
import { NextFunction, Request, Response } from 'express'
import { DecodedIdToken, getAuth } from 'firebase-admin/auth'

import {
  UserRepository,
  MovieRepository,
  // for auto generate showtime today
  ShowtimeRepository,
} from '@repositories'
import { CreateUserDto } from '@dtos'
import { User } from '@entities'

export class HomeController {
  private userRepository: UserRepository
  private movieRepository: MovieRepository
  // for auto generate showtime today
  private showtimeRepository: ShowtimeRepository

  constructor() {
    this.userRepository = new UserRepository()
    this.movieRepository = new MovieRepository()
    // for auto generate showtime today
    this.showtimeRepository = new ShowtimeRepository()
  }

  public home = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // for auto generate showtime today
      const showtime =
        await this.showtimeRepository.getShowtimeTodayAndTomorrow()
      if (!showtime.length) {
        await Promise.all([
          this.showtimeRepository.createShowtimeTodayAndTomorrow(),
          this.movieRepository.generateComingSoonMovie(),
        ])
      }

      const { user } = res.locals
      const [movies, movieLatest, movieTopRated, movieComingSoon] =
        await Promise.all([
          this.movieRepository.getAllMovie(),
          this.movieRepository.getLatestMovies(),
          this.movieRepository.getTopRateMovies(),
          this.movieRepository.getComingSoonMovies(),
        ])
      res.render('home', {
        title: __('Home'),
        username: user?.fullName,
        movies,
        prevMovie: movies[movies.length - 1],
        nextMovie: movies[1],
        movieLatest,
        movieTopRated,
        movieComingSoon,
      })
    } catch (error) {
      next(error)
    }
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body
    let response: DecodedIdToken
    try {
      response = await getAuth().verifyIdToken(idToken)
      const user: User = await this.userRepository.findOne({
        where: {
          email: response.email,
        },
        withDeleted: true,
      })
      if (!user) {
        const userData = plainToInstance(CreateUserDto, {
          email: response.email,
          fullName: response.name,
        })
        const errors = await validate(userData)
        if (errors.length === 0) {
          await this.userRepository.save(this.userRepository.create(userData))
        }
      } else {
        if (user.deletedAt) {
          await this.userRepository.restore(user.id)
        }
        if (!user.avatarUrl && response.picture) {
          user.avatarUrl = response.picture
          await this.userRepository.save(user)
        }
      }
      const expiresIn = 24 * 60 * 60 * 1000 * +process.env.SESSION_LOGIN_DAYS
      const session = await getAuth().createSessionCookie(idToken, {
        expiresIn,
      })
      res.cookie('authToken', session, {
        expires: new Date(Date.now() + expiresIn),
      })
      res.status(StatusCodes.OK).json({ message: 'Login success' })
    } catch (error) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: __('Something is error!') })
    }
  }

  public logout = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.clearCookie('authToken')
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  }

  public configLanguage = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      const { lang } = req.query
      res.cookie('language', lang, { maxAge: 900000, httpOnly: true })
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  }

  public upload = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json({ url: res.locals.url })
    } catch (err) {
      console.log(err)
      res.json({ message: 'Upload error' })
    }
  }

  public getCelebrities = (req: Request, res: Response) => {
    res.render('celebrities', { title: __('Celebrities') })
  }

  public getBlogs = (req: Request, res: Response) => {
    res.render('blog', { title: __('Blogs') })
  }

  public getBlogDetail = (req: Request, res: Response) => {
    res.render('blog-details', { title: __('Blog detail') })
  }
}
