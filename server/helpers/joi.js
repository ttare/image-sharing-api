import Joi from "joi";

export function validate(object, schema, options) {
  return new Promise((resolve) => {
    Joi.validate(object, schema, options, function (error) {
      return resolve(error);
    });
  });
}
