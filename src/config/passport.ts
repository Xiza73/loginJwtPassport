
import passport from 'passport'
const LocalStrategy = require('passport-local').Strategy

//passport settings
passport.use(new LocalStrategy((username: string, password: string, done: any) => {
    try{
        if(username == 'asd' && password == '123'){
            return done(null, {
                id: 1,
                name: 'Xiza'
            })
        }
        return done(null, false)
    }catch(err){
        return done(err, false)
    }
}))
//serialización
passport.serializeUser((user: Express.User | any, done: any) => {
    done(null, user.id)
})
//deserialización
passport.deserializeUser((id, done) => {
    done(null, {
        id: 1,
        name: 'Xiza'
    })
})