const Joi = require("joi");

const updatedUserSchema = Joi.object({
  password: Joi.string(),
  email: Joi.string().email(),
  subscription: Joi.string().valid("starter", "pro", "business"),
  token: Joi.string(),
  avatarURL: Joi.string(),
}).required();

module.exports = updatedUserSchema;
