import path from 'path';

const env = process.env.NODE_ENV || 'development';
const config = require(`./${env}`).default;

const defaults = {
  root: path.join(__dirname, '/..'),
  bodyParserLimit: '50mb',
  secret: 'mynameistarikkaldzijaandilovees6',
  facebookAuth: {
    clientID: '228231097639351',
    clientSecret: '54e77a067bc255666098b48216670dd4',
    callbackURL: 'http://localhost:8000/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email']
  }
};

export default Object.assign(defaults, config);
