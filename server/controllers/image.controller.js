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

    console.log("uradio", pages, offset)

    Image.findAll({
      where,
      offset,
      limit,
      subQuery: false,
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("likes.id")), "likes"],
          [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "comments"],
        ]
      },
      group: ['Image.id'],
      include: [
        {
          model: Tag,
          attributes: ['name'],
          through: {attributes: []},
        }, {
          model: Album,
          include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          },
          attributes: ['id', 'name'],
          through: {attributes: []}
        },
        {
          model: Like,
          attributes: []
        },
        {
          model: Comment,
          attributes: [],
        },
      ]
    })
      .then(images => {
        return res.json({images, total: data.count, pages, page: req.query.page})
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
        size: req.file.size
      });
      return image.save();
    })
    .then(image => {
      imageRef = image;
      return albumRef.addImage(image)
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
          attributes: ['id', 'firstName', 'lastName']
        },
        attributes: ['id', 'name'],
        through: {attributes: []}
      },
      {
        model: Like,
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
      },
      {
        model: Comment,
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
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


/*
SELECT `Image`. *, `Tags`.`name`
AS `Tags.name`, `Tags.ImageTags`.`ImageId`
AS `Tags.ImageTags.ImageId`, `Tags.ImageTags`.`TagName`
AS `Tags.ImageTags.TagName`, `Tags.ImageTags`.`createdAt`
AS `Tags.ImageTags.createdAt`, `Tags.ImageTags`.`updatedAt`
AS `Tags.ImageTags.updatedAt`, `Albums`.`id`
AS `Albums.id`, `Albums`.`name`
AS `Albums.name`, `Albums.AlbumImages`.`id`
AS `Albums.AlbumImages.id`, `Albums.AlbumImages`.`createdAt`
AS `Albums.AlbumImages.createdAt`, `Albums.AlbumImages`.`updatedAt`
AS `Albums.AlbumImages.updatedAt`, `Albums.AlbumImages`.`AlbumId`
AS `Albums.AlbumImages.AlbumId`, `Albums.AlbumImages`.`ImageId`
AS `Albums.AlbumImages.ImageId`, `Albums.User`.`id`
AS `Albums.User.id`, `Albums.User`.`firstName`
AS `Albums.User.firstName`, `Albums.User`.`lastName`
AS `Albums.User.lastName`
FROM(SELECT `Image`.`id`, `Image`.`name`, `Image`.`filename`, `Image`.`size`, `Image`.`createdAt`, COUNT(`likes`.`id`)
AS `likes`
FROM `images`
AS `Image`
GROUP
BY `Image`.`id`
LIMIT
0, 10
)
AS `Image`
LEFT
OUTER
JOIN `image_tags`
AS `Tags.ImageTags`
ON `Image`.`id` = `Tags.ImageTags`.`ImageId`
LEFT
OUTER
JOIN `tags`
AS `Tags`
ON `Tags`.`name` = `Tags.ImageTags`.`TagName`
LEFT
OUTER
JOIN `album_images`
AS `Albums.AlbumImages`
ON `Image`.`id` = `Albums.AlbumImages`.`ImageId`
LEFT
OUTER
JOIN `albums`
AS `Albums`
ON `Albums`.`id` = `Albums.AlbumImages`.`AlbumId`
LEFT
OUTER
JOIN `users`
AS `Albums.User`
ON `Albums`.`userId` = `Albums.User`.`id`
LEFT
OUTER
JOIN `likes`
AS `Likes`
ON `Image`.`id` = `Likes`.`ImageId`
LEFT
OUTER
JOIN `comments`
AS `Comments`
ON `Image`.`id` = `Comments`.`ImageId`;


*/
