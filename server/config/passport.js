import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import config from "./env";
import APIError from "../helpers/APIError";
import {User, Album} from "../db";

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
      console.log("prof", profile)
      const profileImage = `https://graph.facebook.com/${profile.id}/picture?type=medium`;
      const name = profile.displayName.split(' ');
      const data = {
        firstName: name[0],
        lastName: name[name.length - 1],
        email: profile.username || profile.emails[0].value,
        facebookId: profile.id,
        profileImage,
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
            let fbUpdate = {};

            if (!user.facebookId) {
              fbUpdate.facebookId = data.facebookId;
              if (!user.profileImage) {
                fbUpdate.profileImage = profileImage;
              }

              return user.updateAttributes(fbUpdate).then((data) => done(null, data));
            } else {
              if (!user.profileImage || (user.profileImage.includes('graph.facebook') && user.profileImage !== profileImage)) {
                fbUpdate.profileImage = profileImage;
                return user.updateAttributes(fbUpdate).then((data) => done(null, data));
              }

              return done(null, user);
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
                album.save().then(() => done(null, user));
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

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

}
