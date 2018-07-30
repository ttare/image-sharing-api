import Joi from 'joi';

export default {
  // POST /api/users
  create: {
    body: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
    })
  },
  // GET /api/users/:userId
  updateUser: {}
}
