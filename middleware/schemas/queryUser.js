const Joi = require("joi");

const queryUsersShema = Joi.object({
    name: Joi.string().optional().allow(''),
    lastName: Joi.string().optional().allow(''),
    email: Joi.string().email().optional().allow(''),
    number: Joi.string().optional().allow(''),
    broker: Joi.number().min(1).max(99999).integer().required(),
    RequestPage: Joi.number().required(),
    itemsForPage: Joi.number().required(),
    sourceIP: Joi.string(),
});

const queryUserShema = Joi.object({
    type: Joi.string().required(),
    number: Joi.alternatives(
        Joi.string(),
        Joi.number().min(1).max(9999999999).integer()
    ).required(),
    broker: Joi.number().min(1).max(99999).integer().required(),
    sourceIP: Joi.string(),
});

module.exports = {
    queryUsersShema,
    queryUserShema
};
