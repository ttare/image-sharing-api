import { Tag } from '../db';

function search(req, res, next) {
  Tag.findAll({
    where: {
      name: {
        $like: `${req.query.query}%`
      }
    }
  })
    .then((tags) => res.send(tags))
    .catch((error) => next(error));
}

export default {
  search
}
