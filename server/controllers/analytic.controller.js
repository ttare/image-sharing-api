import sequelize  from 'sequelize';
import {ImageTags, Tag} from '../db';

function search(req, res, next) {
  console.log(req.body);
  ImageTags.findAll({
    attributes:{
      include:[
        [sequelize.fn('count', sequelize.col('ImageId')), 'image']
      ]
    },
    group: ['createdAt']
  })
    .then(data => res.send(data))
    .catch(error => next(error));
}

export default {
  search
}
