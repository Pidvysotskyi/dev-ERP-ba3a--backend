const Joi = require("joi");

const loginUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
  token: Joi.string(),
}).required();

module.exports = loginUserSchema;
