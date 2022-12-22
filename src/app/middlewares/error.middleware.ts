import { logger } from '@shared/providers'
import { NextFunction, Request, Response } from 'express'

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status: number = error.status || 500
    const message: string = error.message || 'Something went wrong'

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
      error,
    )
    status === 404
      ? res.render('404', { title: 'Page Not found' })
      : res.status(status).json({ message })
  } catch (error) {
    next(error)
  }
}
