import { NextFunction, Request, Response } from 'express'
import User, { IUser } from '../models/User'
import jwt from 'jsonwebtoken'
import config from '../config/config'
import ErrorHandler from '../helpers/ErrorHandler'

export class AuthController {

  constructor(){ }

  private createToken = (user: IUser) => {
    return jwt.sign({
      id: user._id,
      username: user.username
    }, config.jwtSecret, {
      expiresIn: '1h' //un día: 86400
    })
  }

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      if(!username || !password) return res.status(400).json({ msg: "Faltan datos" })
  
      const user = await User.findOne({ username })
      if(!user){
        next(new ErrorHandler(422, 'El usuario no se encuentra registrado')) 
        return
      }

      const match = await user.comparePassword(password)
      if(match){
        console.log(this)
        return res.status(200).json({
          token: this.createToken(user)
        })
      }
      
      next(new ErrorHandler(422, 'Correo y/o contraseña incorrectas')) 
      return
    } catch(err) {
      next(new ErrorHandler(400, 'Error al iniciar sesión')) 
      return
    }
  }

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      if(!username || !password) return res.status(400).json({ msg: "Faltan datos" })
  
      const user = await User.findOne({ username })
      if(user){
        next(new ErrorHandler(422, 'El usuario ya está registrado')) 
        return
      }
  
      const newUser = new User({ username, password })
      await newUser.save()
  
      return res.status(201).json({
        msg: 'Usuario registrado correctamente',
        usuario: newUser
      })
    } catch(err) {
      next(new ErrorHandler(400, 'Error al registrar usuario')) 
      return
    }
  }
  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('jwt')
      return res.status(200).json({
        msg: 'Adiós'
      })
    } catch(err) {
      next(new ErrorHandler(400, 'Error al cerrar la sesión')) 
      return
    }
  }
}
