import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import User from "../models/User";
import config from "../config/config";

/*
    Header: Authorization -> Bearer <token>
*/

export class PassportMiddleware {
  private readonly options: StrategyOptions

  constructor(){
    this.options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret
    }
  }
  
  public strategy(){
    return new Strategy(this.options, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        console.log(err);
      }
    });
  }
}


