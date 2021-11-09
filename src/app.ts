import express, { Application, Response, Request, NextFunction } from 'express'
import './database'
import passport from 'passport'
import { PassportMiddleware } from './middlewares/passport'
import './config/passport'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import morgan from 'morgan'
import { Routes } from './router'
import ErrorHandler from './helpers/ErrorHandler'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'

export class App {
  private readonly _app: Application
  private readonly _router: Routes
  private readonly _passport: PassportMiddleware

  constructor() {
    dotenv.config()
    this._app = express()
    this._router = new Routes()
    this._passport = new PassportMiddleware()
    this.setting()
    this.middlewares()
    this.router()
    this.staticF()
  }

  setting(): void {
    this._app.set('port', process.env.PORT?? '5000')
  }

  middlewares(): void {
    this._app.use(morgan('dev'))
    this._app.use(express.urlencoded({ extended: true })) //leer data json
    this._app.use(express.json())
    this._app.use(cors())
    this._app.use(cookieParser('my secret'))
    this._app.use(session({
        secret: 'my secret',
        resave: true, 
        saveUninitialized: true
    }))
    this._app.use(passport.initialize())
    passport.use(this._passport.strategy())
    this._app.use(passport.session())
  }

  router(): void {
    this._app.use('/', this._router.router)
    this._app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
      return res.status(err.statusCode || 500).json({
        status: 'error',
        statusCode: err.statusCode,
        message: err.message
      })
    })
  }

  staticF(): void {
    this._app.use(express.static(path.join(__dirname, 'public')))
    this._app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, 'public/index.html'))
    })
  }

  listen(): void {
    this._app.listen(this._app.get('port'))
    console.log(`Server on port ${this._app.get('port')}`)
  }
}
