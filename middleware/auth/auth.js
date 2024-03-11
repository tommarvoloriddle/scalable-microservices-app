// Authenticacte JWT token
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const secret = 'JWT_SECRET';

const passport = require('passport');   

passport.use(
    new JWTstrategy(
        {
            secretOrKey: secret,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            console.log('JWTstrategy', token);
            try {
                return done(null, token.username);
            } catch (error) {
                done(error);
            }
        }
    )
);

module.exports = passport; 