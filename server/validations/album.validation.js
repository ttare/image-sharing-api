import Joi from 'joi';

export default {
  // POST /api/albums/create
  create: {
    body: Joi.object().keys({
      name: Joi.string().required(),
    })
  },
  // GET /api/albums/:id
  get: {
    params: Joi.object().keys({
      id: Joi.string().required().guid(),
    })
  },
}
