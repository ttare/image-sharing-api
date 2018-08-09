import {User, Album, Image, Tag, Like, Comment} from "../db";
import Sequelize from 'sequelize';
import APIError from "../helpers/APIError";

function search(req, res, next) {
  let where = {};
  if (req.query.query) {
    const query = `%${req.query.query}%`;
    where = {
      $or: [
        {
          name: {
            $like: `%${query}%`
          }
        },
        ['EXISTS( SELECT * FROM "image_tags" WHERE TagName LIKE ? AND "ImageId" = "Image".id )', query],

      ]
    };
  }

  Image.findAndCount({where}).then(data => {
    let {page, limit} = req.params;      // page number
    let pages = Math.ceil(data.count / limit);
    let offset = limit * (page - 1);

    const include = [
      [
        Sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.ImageId = Image.id)`),
        'likes'
      ],
      [
        Sequelize.literal(`(SELECT COUNT(*) FROM Comments WHERE Comments.ImageId = Image.id)`),
        'comments'
      ],
    ];
    if (req.user) {
      include.push([
        Sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = '${req.user.id}')`),
        'likedByLoggedUser'
      ]);
    }

    Image.findAll({
      subQuery: false,
      offset,
      limit,
      attributes: {include},
      group: ['Image.id', 'Tags.ImageTags.TagName'],
      include: [
        {
          model: Tag,
          attributes: ['name'],
          through: {attributes: []},
        },
        {
          model: Album,
          attributes: ['id', 'name'],
          include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'profileImage']
          },
        },
        {
          model: Like,
          attributes: [],
        },
        {
          model: Comment,
          attributes: [],
        },
      ]
    })
      .then(images => {
        return res.json({images, totalImages: data.count, totalPages: pages, page: req.params.page})
      })
      .catch(error => next(error));
  }).catch(error => next(error));


}

function create(req, res, next) {
  let albumRef, imageRef;

  Album.findById(req.body.albumId)
    .then((album) => {
      if (!album) {
        const error = new APIError('Bad Request', 400);
        return next(error);
      }
      albumRef = album;
      let image = Image.build({
        name: req.body.name,
        filename: req.file.filename,
        size: req.file.size,
        AlbumId: req.body.albumId
      });
      return image.save();
    })
    .then(image => {
      imageRef = image;
      return albumRef.addImage(image);
    })
    .then(() => {
      let tagsArray = JSON.parse(req.body.tags);
      const tags = tagsArray.map(item => ({
        name: item
      }));
      return Tag.bulkCreate(tags, {ignoreDuplicates: true});
    })
    .then(tags => {
      return imageRef.addTags(tags, {ignoreDuplicates: true});
    })
    .then(data => {
      const json = Object.assign({}, imageRef.dataValues, {tags: data[0]});
      return res.json(json);
    })
    .catch(err => next(err));
}

function details(req, res, next) {
  Image.findById(req.params.id, {
    include: [
      {
        model: Tag,
        attributes: ['name'],
        through: {attributes: []},
      }, {
        model: Album,
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        },
        attributes: ['id', 'name'],
        through: {attributes: []}
      },
      {
        model: Like,
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        },
      },
      {
        model: Comment,
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        },
      },
    ]
  })
    .then(image => {
      if (!image) {
        throw new APIError('Bad Request', 400);
      }

      return res.json(image)
    })
    .catch(error => next(error));
}

function like(req, res, next) {
  const likeObj = {
    ImageId: req.params.id,
    UserId: req.user.id,
  };
  const likeBody = Object.assign({}, likeObj, {like: req.body.like});

  Like.findOne({where: likeObj}).then(like => {
    if (like) {
      return like.updateAttributes(likeBody)
        .then(like => res.json(like))
        .catch(error => next(error));
    }

    return Image.findById(req.params.id).then(image => {
      if (!image) {
        throw new APIError('Bad request', 400);
      }

      return image.createLike(likeBody);
    }).then(like => res.json(like))

  }).catch(error => next(error));
}

function comment(req, res, next) {
  const commentObj = {
    ImageId: req.params.id,
    UserId: req.user.id,
  };
  const commentBody = Object.assign({}, commentObj, {text: req.body.text});

  Image.findById(req.params.id)
    .then(image => {
      if (!image) {
        throw new APIError('Bad request', 400);
      }

      return image.createComment(commentBody);
    })
    .then(comment => res.json(comment))
    .catch(error => next(error));
}

export default {
  search,
  create,
  details,
  like,
  comment,
}
