import { NextFunction, Request, Response } from 'express'
import { AdminRepository } from '@repositories'
import { AdminRole } from '@shared/constants'

export class AdministratorsController {
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
      res.render('admin/administrator', {
        title: 'Administrator',
        layout: 'admin',
        admins,
      })
    } catch (error) {
      next(error)
    }
  }

  public getAddAdminUsersView = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      res.render('admin/form-administrator', {
        title: 'Add administrator',
        layout: 'admin',
        roles: Object.values(AdminRole),
      })
    } catch (error) {
      next(error)
    }
  }

  public getAdminById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const adminData = await this.adminRepository.getAdminById(+id)
      res.render('admin/form-administrator', {
        title: 'Update administrator',
        layout: 'admin',
        roles: Object.values(AdminRole),
        adminData,
      })
    } catch (error) {
      next(error)
    }
  }
}
