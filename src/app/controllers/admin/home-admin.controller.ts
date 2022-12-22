import { NextFunction, Request, Response } from 'express'
import firebase from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/auth'
import { StatusCodes } from 'http-status-codes'
import { Admin } from '@entities'
import { AdminRepository } from '@repositories'
import createHttpError from 'http-errors'

export class HomeAdminController {
  private adminRepository: AdminRepository

  constructor() {
    this.adminRepository = new AdminRepository()
  }

  public homeAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      const { admin, role } = res.locals
      res.render('admin/index', {
        title: 'Home Admin',
        layout: 'admin',
        admin,
        role,
      })
    } catch (error) {
      next(error)
    }
  }

  public getLoginAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      res.render('admin/login', { layout: 'login', title: 'Login Admin' })
    } catch (error) {
      next(error)
    }
  }

  public loginAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { idToken } = req.body
    let response: DecodedIdToken
    try {
      response = await firebase.auth().verifyIdToken(idToken)
      const admin: Admin = await this.adminRepository.findOne({
        where: {
          email: response.email,
        },
      })
      if (!admin) {
        return next(createHttpError(400, 'Login fail'))
      }
      res.cookie('adminToken', idToken, {
        expires: new Date(Date.now() + 3600000 * 1),
      })
      res.status(StatusCodes.OK).json({ message: 'login success' })
    } catch (error) {
      next(error)
    }
  }

  public logoutAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      res.clearCookie('adminToken')
      res.redirect('/admin/login')
    } catch (error) {
      next(error)
    }
  }

  public checkDefaultPassword = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      const { admin } = res.locals
      res.json({ isDefaultPassword: admin.isDefaultPassword })
    } catch (error) {
      next(error)
    }
  }
}
