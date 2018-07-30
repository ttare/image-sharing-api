import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router(); // eslint-disable-line new-cap

fs.readdirSync(__dirname)
  .filter((filename) => filename !== 'index.js')
  .forEach((file) => {
    const route = require(path.join(__dirname, file)).default;
    const fileName = file.split('.')[0];
    const routePath = `/${fileName}${fileName !== 'auth' ? 's' : ''}`;
    router.use(routePath, route);
  });

export default router;

