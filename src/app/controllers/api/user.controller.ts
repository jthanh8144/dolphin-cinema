import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { UserRepository } from '@repositories'
import { __ } from 'i18n'

export class ApiUsersController {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
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
}
