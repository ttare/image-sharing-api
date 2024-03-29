import Sequelize from 'sequelize';
import {User, Image, Album, AlbumImages} from '../db';
import APIError from '../helpers/APIError';

function create(req, res, next) {
  const body = {
    name: req.body.name,
    userId: req.user.id
  };

  Album.findOne({
    where: body
  }).then((album) => {
    if (album) {
      const error = new APIError('Album already exist', 400);
      return next(error);
    }

    Album.build(body).save().then((data) => res.send(data));

  }).catch((error) => next(error));
}

function list(req, res, next) {
  Album.findAll({
    where: {
      userId: req.user.id,
    },
    attributes: {
      include: [
        [Sequelize.fn('COUNT', Sequelize.col('Images.id')), 'totalImages']
      ]
    },
    group: ['Album.id'],
    include: [
      {
        model: User,
        attributes: ['firstName', 'lastName', 'profileImage']
      },
      {
        model: Image,
        attributes: [],
        through: {
          model: AlbumImages,
          attributes: []
        }
      }
    ]
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
      return album.getImages();
    })
    .then(images => res.json({album: albumRef, images}))
    .catch((error) => next(error));
}

export default {
  create,
  list,
  get,
}
