import Joi from 'joi';

export default {
  // GET /api/images/search
  search: {
    query: Joi.object().keys({
      query: Joi.string(),
    })
  },
  // POST /api/images/create
  create: {
    body: Joi.object().keys({
      albumId: Joi.string().required().guid(),
      name: Joi.string().required(),
      tags: Joi.array().items(Joi.string())
    }),
    file: Joi.object().keys({
      filename: Joi.string().required(),
      size: Joi.number().required(),
    }),
  },
  // GET /api/images/:id
  get: {
    params: Joi.object().keys({
      id: Joi.string().required().guid(),
    })
  },
}
