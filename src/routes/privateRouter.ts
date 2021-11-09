import { Router } from "express";
import { PrivateController } from "../controller/privateController";
import passport from 'passport'

export class PrivateRouter {
  private readonly _router: Router = Router();
  private readonly _controller: PrivateController = new PrivateController();

  constructor() {
    this._configure();
  }

  get router(): Router {
    return this._router;
  }

  private _configure(): void {
    this._router.get('/special', passport.authenticate('jwt'/*, { session: false }*/), this._controller.special);
    this._router.get('/nospecial', this._controller.noSpecial);
  }
}
