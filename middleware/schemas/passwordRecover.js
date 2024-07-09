const Joi = require("joi");

const passwordRecoverSchema = Joi.object({
  type: Joi.string().required(),
  number: Joi.string().required(),
  sourceIP: Joi.string(),
});

module.exports = passwordRecoverSchema;
