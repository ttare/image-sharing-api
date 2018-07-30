import APIError from "../helpers/APIError";
import {validate} from "../helpers/joi";

export default function (validator, options) {
  return function (req, res, next) {
    const properties = Object.keys(validator);
    const opts = Object.assign({}, options, {abortEarly: false})
    const promises = properties.map(property => validate(req[property], validator[property], opts));

    Promise.all(promises).then(data => {
      const errors = data.reduce(function (array, error, index) {
        if (error) {
          array = array.concat(error.details.map(item => ({
            message: item.message,
            path: `${properties[index]}.${item.path}`
          })));
        }
        return array;
      }, []);

      const isValid = Object.keys(errors).length === 0;

      if (isValid) {
        return next();
      }
      const error = new APIError(errors, 400, true);
      return next(error);
    });
  }
}
