import { getAuth } from 'firebase-admin/auth'
import { NextFunction, Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { StatusCodes } from 'http-status-codes'
import { generate } from 'generate-password'
import { AdminRepository } from '@repositories'
import { AdminRole } from '@shared/constants'
import { CreateAdminDto, UpdateAdminDto } from '@dtos'
import { sendEmailCreateAdmin, sendEmailResetPassword } from '@app/services'

export class ApiAdministratorsController {
  private adminRepository: AdminRepository

  constructor() {
    this.adminRepository = new AdminRepository()
  }

  public getListAdminUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const admins = await this.adminRepository.getAllAdmins()
      res.json(admins)
    } catch (error) {
      next(error)
    }
  }

  public getAdminByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email } = req.body
      const admin = await this.adminRepository.getAdminByEmail(email)
      res.json(admin)
    } catch (error) {
      next(error)
    }
  }

  public addAdminUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, fullName, role } = req.body
      const adminData = plainToInstance(CreateAdminDto, {
        email,
        fullName,
        role: AdminRole[role],
      })
      const errors = await validate(adminData)
      if (errors.length === 0) {
        const password = generate({ length: 6, numbers: true })
        await getAuth().createUser({
          email,
          password,
          displayName: fullName,
          emailVerified: false,
        })
        const verifyLink = await getAuth().generateEmailVerificationLink(email)
        await sendEmailCreateAdmin(email, password, verifyLink)
        const admin = await this.adminRepository.getDeletedAdminByEmail(email)
        if (admin) {
          await this.adminRepository.restore(admin.id)
        } else {
          await this.adminRepository.save(
            this.adminRepository.create(adminData),
          )
        }
        res.json({
          message:
            'Create admin user success! A mail has sent to your email, please verify email!',
        })
      } else {
        res
          .status(StatusCodes.EXPECTATION_FAILED)
          .json({ message: 'Something is error!' })
      }
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Something is error!' })
    }
  }

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const admin = await this.adminRepository.getAdminById(+id)
      const password = generate({ length: 6, numbers: true })
      const { uid } = await getAuth().getUserByEmail(admin.email)
      await Promise.all([
        getAuth().updateUser(uid, { password }),
        sendEmailResetPassword(admin.email, password),
      ])
      res.json({
        message: 'A mail has been sent to your email to reset password!',
      })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Something is error!' })
    }
  }

  public updateAdminUser = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const { fullName, role } = req.body
      const adminData = plainToInstance(UpdateAdminDto, {
        fullName,
        role: AdminRole[role],
      })
      const errors = await validate(adminData)
      if (errors.length === 0) {
        await this.adminRepository.updateAdminProfile(+id, adminData)
        res.json({ message: 'Update admin user success!' })
      } else {
        res
          .status(StatusCodes.EXPECTATION_FAILED)
          .json({ message: 'Something is error!' })
      }
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Something is error!' })
    }
  }

  public deleteAdminUser = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const { email } = await this.adminRepository.getAdminById(+id)
      const { uid } = await getAuth().getUserByEmail(email)
      await Promise.all([
        getAuth().deleteUser(uid),
        this.adminRepository.softDeleteAdmin(+id),
      ])
      res.json({ message: 'Delete admin success' })
    } catch (error) {
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ message: 'Something is error!' })
    }
  }
}
