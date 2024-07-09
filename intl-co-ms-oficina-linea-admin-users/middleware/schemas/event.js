const Joi = require("joi");

const mainEventSchema = Joi.object({
  body: Joi.object({
    data: Joi.alternatives(
      Joi.string(),
      Joi.object()
    ).required(),
  }).required(),
  path: Joi.string().required(),
  sourceIP: Joi.string(),
});

module.exports = mainEventSchema;
