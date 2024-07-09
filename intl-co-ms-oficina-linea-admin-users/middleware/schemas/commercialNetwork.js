const Joi = require("joi");

const commercialNetworkSchema = Joi.object().keys({
  user: Joi.string(),
  selectedKey: Joi.string(),
  sourceIP: Joi.string(),
}).min(1);

module.exports = commercialNetworkSchema;
