const Joi = require("joi");

const newPersonaSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  patronym: Joi.string(),
}).required();

module.exports = newPersonaSchema;
