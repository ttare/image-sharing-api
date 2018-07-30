import passport from "passport";
import APIError from "../helpers/APIError";

const publicUrls = {
  '/api/users/create': true,
  '/api/auth/login': true
};

const adminUrls = {
  '/api/users/list': true
};

function isUserAuthorized(url, user) {
  if (adminUrls[url]) {
    return user.role === 'admin';
  }
  return true;
}

export function isAuthenticated (req, res, next) {
  const url = req.originalUrl;
  if (publicUrls[url]) {
    return next();
  }
  return passport.authenticate('jwt', {session: false})(req, res, next);
}

export function isAuthorized(req, res, next) {
  console.log("req", req.user);
  if (isUserAuthorized(req.originalUrl, req.user)) {
    return next();
  }

  const error = new APIError('Unauthorized access', 401);
  return next(error);
}
