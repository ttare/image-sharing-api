import {User, Album} from '../db';
import APIError from '../helpers/APIError';

function create(req, res, next) {
  let user = User.build(req.body);
  user.salt = user.makeSalt();
  user.password = user.encryptPassword(user.password, (error, passwordHash) => {
    if (error) {
      const err = new APIError(err);
      return next(err);
    }
    user.password = passwordHash;

    user.save()
      .then((user) => {
        let album = Album.build({ userId: user.id });
        return album.save();
      })
      .then((album) => {
        let data = Object.assign({}, user.toJSON(), {album});
        return res.json(data);
      })
      .catch((error) => next(error));
  });
}

function list(req, res, next) {
  User.findAll()
    .then((users) => res.send(users))
    .catch((error) => next(error));
}

function get(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        const error = new APIError('Bad request', 400);
        return next(error)
      }
      return res.send(user)
    })
    .catch((error) => next(error));
}

export default {
  get,
  create,
  list
}
