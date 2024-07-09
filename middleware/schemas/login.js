const Joi = require("joi");

const loginSchema = Joi.object({
  type: Joi.string().required(),
  number: Joi.string().required(),
  password: Joi.string().required(),
  sourceIP: Joi.string(),
});

const gestorSchema = Joi.object({
  user: Joi.object().required(),
  brokerKey: Joi.number().required(),
  sourceIP: Joi.string(),
});

module.exports = {
  loginSchema,
  gestorSchema,
};
