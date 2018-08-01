import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import config from '../config/env';

let db = {
  sequelize: new Sequelize(config.db.name, config.db.username, config.db.password, config.db.options),
  Sequalize: Sequelize
};

fs.readdirSync(__dirname)
  .filter((filename) => filename !== 'index.js')
  .forEach((file) => {
    const model = db.sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((model) => {
  if ('associate' in db[model]) {
    db[model].associate(db);
  }
});


export const User = db.User;
export const Album = db.Album;
export const Image = db.Image;
export const Tag = db.Tag;
export const Comment = db.Comment;
export const Like = db.Like;
export const AlbumImages = db.AlbumImages;
export const ImageTags = db.ImageTags;
export default db;
