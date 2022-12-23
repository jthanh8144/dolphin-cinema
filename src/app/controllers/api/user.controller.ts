import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import {
  UserRepository,
  UserRatingRepository,
  MovieRepository,
  CommentRepository,
} from '@repositories'
import { __ } from 'i18n'
import createHttpError from 'http-errors'
import { CreateCommentDto, UpdateCommentDto, CreateUserRatingDto } from '@dtos'
import { Comment, UserRating } from '@entities'

export class ApiUsersController {
  private userRepository: UserRepository
  private userRatingRepository: UserRatingRepository
  private movieRepository: MovieRepository
  private commentRepository: CommentRepository

  constructor() {
    this.userRepository = new UserRepository()
    this.userRatingRepository = new UserRatingRepository()
    this.movieRepository = new MovieRepository()
    this.commentRepository = new CommentRepository()
  }

  public getUserByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email } = req.body
      const user = await this.userRepository.findOne({
        where: { email },
      })
      res.json({ user })
    } catch (error) {
      next(error)
    }
  }

  public updateProfile = (req: Request, res: Response): void => {
    try {
      const { user } = res.locals
      const { fullName, birthday } = req.body
      this.userRepository.updateProfile(user.id, { fullName, birthday })
      res.json({ message: __('Update profile success!') })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: __('Update profile fail. Please try again!') })
    }
  }

  public updatePassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { user } = res.locals
      const { oldPassword, newPassword } = req.body
      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        user.email,
        oldPassword,
      )
      await updatePassword(userCredential.user, newPassword)
      await getAuth().signOut()
      res.json({ message: __('Update password success!') })
    } catch (error) {
      res.status(StatusCodes.EXPECTATION_FAILED)
      if (error instanceof FirebaseError) {
        if (error.message.includes('wrong-password')) {
          res.json({ message: __('Old password is incorrect!') })
        }
      } else {
        res.json({ message: __('Something is error!') })
      }
    }
  }

  public sendEmailResetPassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { email } = req.body
      await sendPasswordResetEmail(getAuth(), email, {
        url: process.env.APP_HOST,
      })
      res.json({
        message: __('A mail has sent to your email to reset password!'),
      })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: __('Something is error!') })
    }
  }

  public createComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const commentData: CreateCommentDto = req.body
      const { user } = res.locals
      const comment = new Comment()
      comment.comment = commentData.comment
      comment.movie = await this.movieRepository.getMovieById(
        commentData.movie_id,
      )
      comment.user = await this.userRepository.getUserById(user.id)
      const createCommentData = await this.commentRepository.save(
        this.commentRepository.create(comment),
      )
      res.status(200).json({
        data: createCommentData,
        message: 'created',
      })
    } catch (error) {
      next(error)
    }
  }

  public getCommentOfUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = +req.params.id
      const comment = await this.commentRepository.findOne({
        where: { id },
      })
      if (!comment) {
        return next(createHttpError(404, 'Not Found'))
      }
      res.status(200).json({ data: comment })
    } catch (error) {
      next(error)
    }
  }

  public updateCommentOfUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = +req.params.id
      const commentMsg: UpdateCommentDto = req.body

      const comment = await this.commentRepository.findOne({
        where: { id },
      })
      if (!comment) {
        return next(createHttpError(404, 'Not Found'))
      }
      const commentData = comment
      commentData.comment = commentMsg.comment

      await this.commentRepository.save(commentData)
      res.status(200).json({ message: 'update success!' })
    } catch (error) {
      next(error)
    }
  }

  public deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = +req.params.id
      const comment = await this.commentRepository.findOne({
        where: { id },
      })
      if (!comment) {
        return next(createHttpError(404, 'Not Found'))
      }
      await this.commentRepository.softDelete(id)

      res.status(200).json({ message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }

  public ratingMovie = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userRatingData: CreateUserRatingDto = req.body
      const { user } = res.locals
      //check user rated ?
      const isRating = await this.userRatingRepository.checkUserRating(
        user.id,
        userRatingData.movie_id,
      )

      if (isRating) {
        isRating.score = userRatingData.score
        await this.userRatingRepository.save(isRating)
      } else {
        const userRating = new UserRating()
        userRating.score = userRatingData.score
        userRating.movie = await this.movieRepository.getMovieById(
          userRatingData.movie_id,
        )
        userRating.user = await this.userRepository.getUserById(user.id)
        await this.userRatingRepository.save(
          this.userRatingRepository.create(userRating),
        )
      }

      //update review score of movie
      let avg = 0
      const movie_id = userRatingData.movie_id
      const findAllRatingOfMovie =
        await this.movieRepository.getAllRatingOfMovieById(movie_id)

      findAllRatingOfMovie.userRatings.forEach((rating) => {
        avg += rating.score
      })

      //update reviewScore in Movie
      const movie = await this.movieRepository.getAllRatingOfMovieById(movie_id)
      movie.reviewScore = avg / findAllRatingOfMovie.userRatings.length
      await this.movieRepository.save(movie)

      res.status(200).json({
        message: 'created',
      })
    } catch (error) {
      next(error)
    }
  }

  public getUserRatingOfMovie = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movieId = +req.params.id
      const movie = await this.movieRepository.findOne({
        where: { id: movieId },
      })
      if (!movie) {
        return next(createHttpError(404, 'Not Found'))
      }
      const { user } = res.locals
      const ratingOfMovieData =
        await this.userRatingRepository.findRatingOfMovie(user.id, movieId)
      res.status(200).json({ data: ratingOfMovieData })
    } catch (error) {
      next(error)
    }
  }
}
