const Joi = require("joi");

const keySchema = Joi.object().keys({
  Broker: Joi.string().required(),
  sourceIP: Joi.string(),
}).min(1);

module.exports = keySchema;
