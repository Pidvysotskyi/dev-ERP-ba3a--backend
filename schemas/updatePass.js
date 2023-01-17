const Joi = require("joi");

const updatePassSchema = Joi.object({
  password: Joi.string().required(),
  id: Joi.number().required(),
}).required();

module.exports = updatePassSchema;
