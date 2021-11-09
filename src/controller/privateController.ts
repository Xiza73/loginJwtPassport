import { NextFunction, Request, Response } from 'express'
import User, { IUser } from '../models/User'
import config from '../config/config'

export class PrivateController {

  constructor(){ }

  public special = (req: Request, res: Response, next: NextFunction) => {
    res.send('logged')
  }

  public noSpecial = (req: Request, res: Response, next: NextFunction) => {
    res.send('no logged')
  }
}
