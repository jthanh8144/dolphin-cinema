import { NextFunction, Request, Response } from 'express'
import { AdminRole } from '@shared/constants'
import { StatusCodes } from 'http-status-codes'

export const adminRoleMiddleware = {
  isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = res.locals
      if (role !== AdminRole.admin) {
        res.status(StatusCodes.FORBIDDEN)
        return res.redirect('/admin')
      }
      next()
    } catch (error) {
      next(error)
    }
  },
  isNotViewer(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = res.locals
      if (role === AdminRole.viewer) {
        res.status(StatusCodes.FORBIDDEN)
        return res.redirect('/admin')
      }
      next()
    } catch (error) {
      next(error)
    }
  },
}
