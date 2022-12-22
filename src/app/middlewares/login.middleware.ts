import { NextFunction, Request, Response } from 'express'
import { DecodedIdToken, getAuth } from 'firebase-admin/auth'
import { IsNull } from 'typeorm'
import { UserRepository } from '@repositories'
import { User } from '@entities'

const userRepository: UserRepository = new UserRepository()

export const loginMiddleware = {
  async isLogged(req: Request, res: Response, next: NextFunction) {
    try {
      const { authToken } = req.cookies
      if (!authToken) {
        return res.redirect('/')
      }
      const response: DecodedIdToken = await getAuth().verifySessionCookie(
        authToken,
        true,
      )
      const { email } = response
      const user = await userRepository.findOne({
        where: { email, deletedAt: IsNull() },
      })
      if (!user) {
        return res.redirect('/')
      }
      next()
    } catch (error) {
      next(error)
    }
  },
  async saveUserLogged(req: Request, res: Response, next: NextFunction) {
    try {
      const { authToken } = req.cookies
      let user: User
      if (authToken) {
        const response: DecodedIdToken = await getAuth().verifySessionCookie(
          authToken,
          true,
        )
        user = await userRepository.findOne({
          where: {
            email: response.email,
            deletedAt: IsNull(),
          },
        })
      }
      res.locals.user = user
      next()
    } catch (error) {
      next(error)
    }
  },
  clearCacheBack(req: Request, res: Response, next: NextFunction) {
    res.set(
      'Cache-Control',
      'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
    )
    next()
  },
}
