const Joi = require("joi");

const blockUsersShema = Joi.object({
    status: Joi.boolean().required(),
    DistinguishedName: Joi.string().required(),
    sourceIP: Joi.string(),
});

const createUsersShema = Joi.object({
    Names: Joi.string().required(),
    LastNames: Joi.string().required(),
    TypeDocument: Joi.string().required(),
    NumberId: Joi.string().required(),
    Broker: Joi.number().required(),
    BrokerChilds: Joi.array().min(1).required(),
    Mail: Joi.string().email().required(),
    Telephone: Joi.string(),
    Cellphone: Joi.number().required(),
    Features: Joi.array().min(1).required(),
    sourceIP: Joi.string(),
    From : Joi.string()
});

const createUsersAdminShema = Joi.object({
    Names: Joi.string().required(),
    LastNames: Joi.string().required(),
    TypeDocument: Joi.string().required(),
    NumberId: Joi.string().required(),
    Broker: Joi.number().required(),
    BrokerChilds:Joi.array().min(1).required(),
    Mail: Joi.string().email().required(),
    Telephone: Joi.string(),
    Cellphone: Joi.number().required(),
    sourceIP: Joi.string(),
});

const createUsersGestorShema = Joi.object({
    Names: Joi.string().required(),
    LastNames: Joi.string().required(),
    TypeDocument: Joi.string().required(),
    NumberId: Joi.string().required(),
    Mail: Joi.string().email().required(),
    Telephone: Joi.string(),
    Cellphone: Joi.number().required(),
    sourceIP: Joi.string(),
});

const updateUsersShema = Joi.object({
    Names: Joi.string().required(),
    LastNames: Joi.string().required(),
    TypeDocument: Joi.string().required(),
    NumberId: Joi.string().required(),
    Broker: Joi.number(),
    BrokerChilds: Joi.array(),
    Mail: Joi.string().email().required(),
    Telephone: Joi.string(),
    Cellphone: Joi.number().required(),
    Features: Joi.array().min(1).required(),
    Verified: Joi.boolean().required(),
    sourceIP: Joi.string(),
});

const deleteUsersShema = Joi.object({
    DistinguishedName: Joi.string().required(),
    CommonName: Joi.string().required(),
    sourceIP: Joi.string(),
});

const queryUserShema = Joi.object({
    type: Joi.string().required(),
    number: Joi.number().min(10000).max(9999999999).integer().required(),
    broker: Joi.number().min(1).max(99999).integer().required(),
    sourceIP: Joi.string(),

});


const queryModulesUserSchema = Joi.object({
    identification: Joi.string().required(),
    key: Joi.number().min(1).max(99999).integer().required(),
    sourceIP: Joi.string(),
});

module.exports = { blockUsersShema, queryUserShema, deleteUsersShema, createUsersShema, queryModulesUserSchema, updateUsersShema ,createUsersAdminShema, createUsersGestorShema};




