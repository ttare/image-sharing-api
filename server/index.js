import config from './config/env';
import app from './config/express';
import db from './db';

function listen(port) {
  app.listen(port, () => {
    console.log(`Started on port ${port}`);
  });
}

if (config.env === 'development') {
  db.sequelize.sync({force: false}).then(function () {
    listen(config.port)
  }).catch(function (e) {
    console.error('sqlite failed', e);
  });
} else {
  listen(config.port)
}


