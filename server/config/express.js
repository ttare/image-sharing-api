import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import bodyParser from 'body-parser';
import expressWinston from 'express-winston';
import passport from 'passport';

import APIError from '../helpers/APIError';
import routes from '../routes';
import {isAuthenticated, isAuthorized} from '../middlewares/auth.middleware';
import config from './env';
import winstonInstance from './winston';
import configurePassport from './passport';

configurePassport(passport);

let app = express();

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json({
  limit: config.bodyParserLimit
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: config.bodyParserLimit,
  parameterLimit: 1000000 // experiment with this parameter and tweak
}));

//parse cookie
app.use(cookieParser());

app.use(compress());

app.use(passport.initialize());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

if (config.env !== 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true,
    ignoreRoute: function (req) {
      return (req.url.indexOf('/api') === -1);
    },
  }));
}

app.use('/', express.static(config.frontend));
app.use('/images', express.static('upload'));

app.use('/api', isAuthenticated, isAuthorized, routes);

app.use((err, req, res, next) => {
  console.log("ssss", err)
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    // if (apiError.status === 400) {
    //   apiError.stack = undefined;
    // }
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', 404);
  return next(err);
});

// log error in winston transports except when executing test suite
app.use(expressWinston.errorLogger({
  winstonInstance,
}));


// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : 'Error on server.',
    stack: config.env === 'development' ? err.stack : {}
  })
);

export default app;
