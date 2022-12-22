import { NextFunction, Request, Response } from 'express'
import { getAuth } from 'firebase-admin/auth'
import { UserRepository } from '@repositories'

export class AdminUsersController {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  public getListUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { role } = res.locals
      const users = await this.userRepository.getAllUsers()
      res.render('admin/user', {
        title: 'User management',
        layout: 'admin',
        role,
        users,
      })
    } catch (error) {
      next(error)
    }
  }

  public getUpdateUserView = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const user = await this.userRepository.getUserById(+id)
      const { disabled } = await getAuth().getUserByEmail(user.email)
      res.render('admin/update-user', {
        title: 'Update user',
        layout: 'admin',
        user,
        disabled,
      })
    } catch (error) {
      next(error)
    }
  }
}
