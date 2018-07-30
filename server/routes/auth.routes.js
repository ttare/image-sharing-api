import express from 'express';
import passport from 'passport';
import authCtrl from '../controllers/auth.controller'

const router = express.Router();

router.post('/login', passport.authenticate('local', {session: false}), authCtrl.login);
router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get('/facebook/callback', OAuthCallback('facebook'));

function OAuthCallback(provider, callback) {
  return (req, res, next) => {
    passport.authenticate(provider, {
      failureRedirect: '/#!/',
      successRedirect: '/#!/'
    })(req, res, next);
  }
}


export default router;
