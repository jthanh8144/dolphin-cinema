import { NextFunction, Request, Response } from 'express'
import { AdminRepository } from '@repositories'

export class AdminsController {
  private adminRepository: AdminRepository

  constructor() {
    this.adminRepository = new AdminRepository()
  }

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { admin } = res.locals
      res.render('admin/admin-profile', {
        title: 'Admin profile',
        layout: 'admin',
        admin,
      })
    } catch (error) {
      next(error)
    }
  }

  public uploadAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { admin, url } = res.locals
      await this.adminRepository.updateAdminProfile(admin.id, {
        avatarUrl: url,
      })
      res.redirect('/admin/profile')
    } catch (error) {
      next(error)
    }
  }
}
