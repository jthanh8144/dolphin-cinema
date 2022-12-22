import { NextFunction, Request, Response } from 'express'

export class AdminsController {
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
}
