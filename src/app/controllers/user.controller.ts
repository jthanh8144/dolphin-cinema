import { CreateUserDto } from '@dtos'
import { NextFunction, Request, Response } from 'express'
import { UserRepository, UserTicketRepository } from '@repositories'
import { __ } from 'i18n'

export class UsersController {
  private userRepository: UserRepository
  private userTicketRepository: UserTicketRepository

  constructor() {
    this.userRepository = new UserRepository()
    this.userTicketRepository = new UserTicketRepository()
  }

  public getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { user } = res.locals
      const bookedTicket = await this.userTicketRepository.getTicketsOfUser(
        +user.id,
      )

      res.render('user', {
        title: __('User'),
        username: user?.fullName,
        user,
        bookedTicket,
      })
    } catch (error) {
      next(error)
    }
  }

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = Number(req.params.id)
      const findOneUserData = await this.userRepository.findOneByOrFail({
        id: userId,
      })

      res.json({ data: findOneUserData, message: 'findOne' })
    } catch (error) {
      next(error)
    }
  }

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = +req.params.id
      const userData: CreateUserDto = req.body

      const updateUserData = await this.userRepository.save(
        this.userRepository.create({
          id,
          ...userData,
        }),
      )

      res.json({ data: updateUserData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      await this.userRepository.delete(id)

      res.json({ message: 'deleted' })
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
      const { user, fileName } = res.locals
      this.userRepository.updateAvatar(user.id, `/file/${encodeURI(fileName)}`)
      res.redirect('/users')
    } catch (error) {
      next(error)
    }
  }
}
