import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
//multers disk storage settings
  destination: function (req, file, cb) {
    const destination = './upload';
    let status = null;
    try {
      status = fs.statSync(destination);
    } catch (err) {
      fs.mkdirSync(destination);
    }
    if (status && !status.isDirectory()) {
      throw new Error('Directory cannot be created because an inode of a different type exists at "' + destination + '"');
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    cb(null, timestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});


export default function(property) {
  return multer({storage}).single(property);
}
