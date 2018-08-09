import multer from 'multer';
import fs from 'fs';

function getStorage(location) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      let status = null;
      try {
        status = fs.statSync(location);
      } catch (err) {
        fs.mkdirSync(location);
      }
      if (status && !status.isDirectory()) {
        throw new Error('Directory cannot be created because an inode of a different type exists at "' + location + '"');
      }
      cb(null, location);
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      cb(null, timestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
  });
}


export default function (location, property) {
  return multer({storage: getStorage(location)}).single(property);
}
