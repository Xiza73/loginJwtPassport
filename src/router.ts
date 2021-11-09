import { Router, Request, Response } from 'express'
import { AuthRouter } from './routes/authRouter'
import { PrivateRouter } from './routes/privateRouter'

export class Routes {
  private readonly _router: Router = Router()
  private readonly _authRoute: AuthRouter = new AuthRouter()
  private readonly _privateRoute: PrivateRouter = new PrivateRouter()

  constructor () {
    this._configure()
  }

  get router (): Router {
    return this._router
  }

  private _configure (): void {
    /*this._router.get('/', (req: Request, res: Response) => { 
      res.json({ 
        msg: 'API works!' 
      }) 
    })*/
    this._router.use('/api', this._authRoute.router)
    this._router.use('/api', this._privateRoute.router)
  }
}
