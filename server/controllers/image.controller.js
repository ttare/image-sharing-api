import {User, Album, Image, Tag, ImageTags} from "../db";
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

  Image.findAll({
    where,
    include: [
      {
        model: Tag,
        attributes: ['name'],
        through: { attributes: [] },
    }, {
      model: Album,
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      attributes: ['id', 'name'],
      through: { attributes: [] }
    },
    ]
  })
    .then(images => {
      return res.send(images);
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

export default {
  search,
  create
}
