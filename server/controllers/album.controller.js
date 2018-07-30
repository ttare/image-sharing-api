import {User, Album } from '../db';
import APIError from '../helpers/APIError';

function create(req, res, next) {
  const album = Album.build(req.body);
  album
    .save()
    .then((album) => res.json(album))
    .catch((error) => next(error));
}

function list(req, res, next) {
  console.log("req", req.user);
  Album.findAll({
    where: {
      userId: req.user.id,
    },
    include: [{
      model: User,
      attributes: ['firstName', 'email']
    }]
  })
    .then((albums) => res.send(albums))
    .catch((error) => next(error));
}

function get(req, res, next) {
  let albumRef;
  Album.findById(req.params.id)
    .then((album) => {
      if (!album) {
        const error = new APIError('Bad Request', 400);
        return next(error);
      }
      albumRef = album;
      return album.getImages()
    })
    .then(images => res.json({album: albumRef, images}))
    .catch((error) => next(error));
}

export default {
  create,
  list,
  get,
}
