const Joi = require("joi");

const loginUserSchema = Joi.object({
  password: Joi.string().required(),
  login: Joi.string().required(),
}).required();

module.exports = loginUserSchema;
