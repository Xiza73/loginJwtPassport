import { Router } from "express";
import { AuthController } from "../controller/authController";
import passport from 'passport'

export class AuthRouter {
  private readonly _router: Router = Router();
  private readonly _controller: AuthController = new AuthController();

  constructor() {
    this._configure();
  }

  get router(): Router {
    return this._router;
  }

  private _configure(): void {
    this._router.post('/signin', this._controller.signIn);
    this._router.post('/signup', this._controller.signUp);
    this._router.post('/logout', passport.authenticate('jwt'),this._controller.logout);
  }
}
