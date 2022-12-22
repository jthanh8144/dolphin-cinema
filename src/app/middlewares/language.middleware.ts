import { NextFunction, Request, Response } from 'express'
import i18n from 'i18n'

export const languageMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.locals.clanguage = req.cookies.lang || req.getLocale()
  res.locals.languages = i18n.getLocales()
  next()
}
