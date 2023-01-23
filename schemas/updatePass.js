const Joi = require("joi");

const strongPass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/;
const strongPassError = new Error(
  "Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length"
);

const updatePassSchema = Joi.object({
  password: Joi.string().pattern(strongPass).min(8).error(strongPassError).required(),
  id: Joi.number().required(),
}).required();

module.exports = updatePassSchema;
