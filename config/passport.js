const Customer =require('../app/models/Customer');
const config = require('./bd');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require("dotenv").config();
// To authenticate the User by JWT Strategy
module.exports = (userType, passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.database.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
            Customer.getUserById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                return done(null, false);      
                });
    }));
}