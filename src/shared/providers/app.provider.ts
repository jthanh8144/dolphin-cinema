import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import hpp from 'hpp'
import {
  errorMiddleware,
  loginMiddleware,
  languageMiddleWare,
  adminAuthMiddleware,
} from '@middlewares'
import { logger } from '.'
import { environment } from '@shared/constants'
import * as routers from '@routers'
import { engine } from 'express-handlebars'
import path from 'path'
import createHttpError from 'http-errors'
import * as helper from '@app/helpers/handlebars'
import http from 'http'
import { Server } from 'socket.io'
import i18n from 'i18n'
import { minioClient } from '@shared/configs/minio.config'

class AppProvider {
  public app: express.Application
  public server: http.Server

  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)

    this.initializeMiddlewares()
    this.initializeViewsEngine()
    this.initializeMultiLanguage()
    this.initializeRoutes()
    this.initializeNotfoundHandling()
    this.initializeErrorHandling()
    this.initializeBucket()
  }

  public listen() {
    this.server.listen(environment.port, () => {
      logger.log(`App listening on the port: ${environment.port}`)
    })
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(hpp())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(loginMiddleware.saveUserLogged)
    this.app.use('/admin/*', adminAuthMiddleware.saveAdminLogged)
    this.app.use('/api/admin/*', adminAuthMiddleware.saveAdminLogged)
    this.app.use(loginMiddleware.clearCacheBack)
    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      )
      next()
    })
  }

  private initializeRoutes() {
    const routeList = Object.values(routers)

    routeList.forEach((route) => {
      this.app.use(route.path, route.router)
    })
  }

  private initializeNotfoundHandling() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(createHttpError(404))
    })
  }
  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private initializeViewsEngine() {
    this.app.engine(
      '.hbs',
      engine({ extname: '.hbs', helpers: helper, defaultLayout: 'main' }),
    )
    this.app.set('view engine', '.hbs')
    this.app.set('views', path.join(__dirname, '../../../views'))
    this.app.use(express.static(path.join(__dirname, '../../../public')))
  }

  private initializeMultiLanguage() {
    i18n.configure({
      locales: ['en', 'vi'],
      register: global,
      fallbacks: { vi: 'en' },
      cookie: 'language',
      queryParameter: 'lang',
      defaultLocale: 'en',
      directory: path.join(__dirname, '../../../languages'),
      directoryPermissions: '755',
      autoReload: true,
      updateFiles: true,
      api: {
        __: '__',
        __n: '__n',
      },
    })
    i18n.setLocale('en')
    this.app.use(i18n.init)
    this.app.use(languageMiddleWare)
  }

  private initializeBucket() {
    minioClient.bucketExists(process.env.BUCKET_NAME, async (error, exists) => {
      if (error) {
        console.log(error)
      }
      if (!exists) {
        minioClient.makeBucket(
          process.env.BUCKET_NAME,
          process.env.BUCKET_REGION,
          function (err) {
            if (err) return console.log('Error creating bucket', err)
            console.log('Bucket data created successfully')
          },
        )
      }
    })
  }
}

export const appProvider = new AppProvider()
export const socket = new Server(appProvider.server)
