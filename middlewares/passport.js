const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt')
const { Account } = require('../models')
const { SECRET_KEY } = process.env


const options = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
const JwtStrategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await Account.findOne({ where: { id: payload.id } })
    if (!user) return done(null, false);

    done(null, user)
  } catch (err) {
    done(err, false)
  }
})

passport.use('jwt-user', JwtStrategy)

const protect = passport.authenticate('jwt-user', { session: false })

module.exports = protect