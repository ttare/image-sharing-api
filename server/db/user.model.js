import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/env';

export default (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'The specific email address is already in use.'
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    salt: DataTypes.STRING,
    googleId: DataTypes.STRING,
    facebookId: DataTypes.STRING
  }, {
    tableName: 'users',
    classMethods: {
      associate: function (db) {
        db.User.hasMany(db.Album, {foreignKey: 'userId'});
      }
    },
    instanceMethods: {
      makeSalt(byteSize = 16) {
        return crypto.randomBytes(byteSize).toString('base64');
      },
      encryptPassword(password, callback) {
        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        const salt = new Buffer(this.salt, 'base64');
        password = password || crypto.randomBytes(16).toString('base64');

        crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha512', (err, key) => {
          if (err) return callback(err);
          callback(null, key.toString('base64'));
        });
      },
      authenticate(password, callback) {
        this.encryptPassword(password, (err, pwd) => {
          if (err) return callback(err);
          callback(null, this.password === pwd)
        });
      },
      toJSON() {
        let user = this.get({plain: true});
        user.password = undefined;
        user.salt = undefined;
        return user;
      },
      genereteAccessToken() {
        return jwt.sign(this.toJSON(), config.secret)
      }
    }
  });
}
