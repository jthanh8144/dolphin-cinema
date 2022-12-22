import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { AdminRepository } from '@repositories'

export class ApiAdminsController {
  private adminRepository: AdminRepository

  constructor() {
    this.adminRepository = new AdminRepository()
  }

  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { admin } = res.locals
      const { fullName } = req.body
      await this.adminRepository.updateAdminProfile(admin.id, { fullName })
      res.json({ message: 'Update profile success!' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Some thing is error!' })
    }
  }

  public updatePassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { admin } = res.locals
      const { oldPassword, newPassword } = req.body
      const adminCredential = await signInWithEmailAndPassword(
        getAuth(),
        admin.email,
        oldPassword,
      )
      await updatePassword(adminCredential.user, newPassword)
      await getAuth().signOut()
      res.json({ message: 'Update password success!' })
    } catch (error) {
      res.status(StatusCodes.EXPECTATION_FAILED)
      if (error instanceof FirebaseError) {
        if (error.message.includes('wrong-password')) {
          res.json({ message: 'Old password is incorrect!' })
        }
      } else {
        res.json({ message: 'Something is error!' })
      }
    }
  }
}
