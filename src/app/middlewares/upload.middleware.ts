import { StatusCodes } from 'http-status-codes'
import Multer, { memoryStorage, FileFilterCallback } from 'multer'
import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'

import { generateFileName } from '@app/helpers/upload.helper'
import { minioClient } from '@shared/configs/minio.config'

export const multerUploadMiddleware = Multer({
  storage: memoryStorage(),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      callback(null, true)
    } else {
      callback(
        createError(
          StatusCodes.BAD_REQUEST,
          'Only .png, .jpg and .jpeg format allowed!',
        ),
      )
    }
    if (
      +req.headers['content-length'] >
      +(process.env.FILE_SIZE_LIMIT || 5) * 1024 * 1024
    ) {
      callback(createError(StatusCodes.REQUEST_TOO_LONG, 'File too large'))
    }
  },
}).single('image')

export const fileUploadMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Image is required' })
    }
    const fileName = generateFileName(req.file.originalname)
    await minioClient.putObject(
      process.env.BUCKET_NAME,
      fileName,
      req.file.buffer,
    )
    res.locals.url = `https://${process.env.MINIO_HOST}/${process.env.BUCKET_NAME}/${fileName}`
    next()
  } catch (error) {
    next(error)
  }
}
