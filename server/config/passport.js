import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import config from "./env";
import APIError from "../helpers/APIError";
import {User} from "../db";

export default function (passport) {

  passport.use(new LocalStrategy({passReqToCallback: true, usernameField: 'email'}, (req, email, password, done) => {
    User.findOne({where: {email}}).then(user => {
      if (!user) {
        const err = new APIError('Invalid password or email address.', 400, false);
        return done(err);
      }
      user.authenticate(password, (error, authenticated) => {
        if (error || authenticated === false) {
          const err = new APIError('Invalid password or email address.', 400, true);
          return done(err);
        }

        return done(null, user);
      });
    }).catch(error => {
      const err = new APIError(error);
      return done(err);
    });
  }));

  passport.use(new FacebookStrategy(config.facebookAuth, (accessToken, refreshToken, profile, done) => {
      const data = {
        name: profile.displayName,
        email: profile.username || profile.emails[0].value,
        facebookId: profile.id
      };
      const query = {
        where: {
          $or: [
            {email: data.email},
            {facebookId: data.id}
          ]
        }
      };

      User.findOne(query)
        .then((user) => {
          if (user) {
            if (!user.facebookId) {
              user.updateAttributes({facebookId: data.facebookId}).then(() => done(null));
            } else {
              return done(null);
            }
          } else {
            user = User.build(data, {include: [Album]});
            user.salt = user.makeSalt();
            user.encryptPassword(null, (err, password) => {
              if (err) return done(err);
              user.password = password;

              user.save().then((user) => {
                let album = Album.build({
                  userId: user.id
                });
                album.save().then(() => done(null));
              });
            });
          }
        }).catch((err) => done(err));
    })
  );

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret,
  };

  passport.use(new JWTStrategy(opts, (user, done) => done(null, user)));

}
