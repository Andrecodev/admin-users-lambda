const { OK_RESPONSE_TEMPLATE } = require("../models/response-templates");
const { MODULES_MOCK, USER_MODULES_MOCK } = require("./modulesMock");
const { COMPANIES_DYNAMO_RESPONSE } = require("./companiesMock");
const { LOGIN_SESSION_MOCK } = require("./loginTableMock");

const { LOGIN_TABLE, COMPANIES_TABLE, USER_MODULES_TABLE, MODULES_TABLE, LOG_TABLE } = process.env;

const dynamoMock = (tableName) => {
  const response = {
    [LOGIN_TABLE]: LOGIN_SESSION_MOCK,
    [COMPANIES_TABLE]: COMPANIES_DYNAMO_RESPONSE,
    [MODULES_TABLE]: MODULES_MOCK,
    [USER_MODULES_TABLE]: USER_MODULES_MOCK,    
    [LOG_TABLE]: USER_MODULES_MOCK,   
  };

  return response[tableName] || OK_RESPONSE_TEMPLATE;
};

module.exports = {
  dynamoMock,
};
