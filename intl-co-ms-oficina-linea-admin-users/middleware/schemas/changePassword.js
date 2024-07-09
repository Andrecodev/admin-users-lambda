const Joi = require("joi");

const changePasswordSchema = Joi.object({
  type: Joi.string().required(),
  number: Joi.string().required(),
  newPassword: Joi.string().required(),
  password: Joi.string().required(),
  sourceIP: Joi.string(),
});

module.exports = {
  changePasswordSchema
};
