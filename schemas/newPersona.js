const Joi = require("joi");

const newPersonaSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  surName: Joi.string().required(),
}).required();

module.exports = newPersonaSchema;
