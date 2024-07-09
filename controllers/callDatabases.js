const { DynamoDB } = require("aws-sdk");

const { COMPANIES_TABLE, LOGIN_TABLE, MODULES_TABLE, USER_MODULES_TABLE , LOG_TABLE } = process.env;

let dynamodb;
const dynamoDBClient = () => dynamodb ? dynamodb : (dynamodb = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" }));

const getCompanies = async () => {
  const params = {
    TableName: COMPANIES_TABLE,
  };

  const dynamoResponse = await dynamoDBClient().scan(params).promise();
  const response = dynamoResponse ? dynamoResponse : null;

  return response;
};

const getLastSession = async (userId) => {
  const params = {
    TableName: LOGIN_TABLE,
    Key: {
      "userId": userId,
    },
  };

  const lastSession = await dynamoDBClient().get(params).promise();
  const lastSessionInfo = lastSession && lastSession.Item ? lastSession.Item : null;

  return lastSessionInfo;
};

const updateLastSession = async (data) => {
  const params = {
    TableName: LOGIN_TABLE,
    Item: data,
  };

  const dynamoResponse = await dynamoDBClient().put(params).promise();
  const response = dynamoResponse ? "OK" : null;

  return response;
};

const getModules = async () => {
  const params = {
    TableName: MODULES_TABLE,
  };

  const dynamoResponse = await dynamoDBClient().scan(params).promise();
  const response = dynamoResponse?.Items || [];

  return response;
};

const getUserModules = async (userId) => {
  const params = {
    TableName: USER_MODULES_TABLE,
    Key: {
      "userId": userId,
    },
  };

  const dynamoResponse = await dynamoDBClient().get(params).promise();
  const response = dynamoResponse?.Item || {};

  return response;
};

const createUserModules = async ({ userId, modules }) => {
  const params = {
    TableName: USER_MODULES_TABLE,
    Item: {
      userId,
      modules,
    },
  };

  const dynamoResponse = await dynamoDBClient().put(params).promise();
  const response = dynamoResponse ? `Modules added to ${userId} user` : null;

  return response;
};

const updateModulesPerUser = async ({ userId, modules }) => {
  const params = {
    TableName: USER_MODULES_TABLE,
    Key: {
      "userId": userId,
    },
    UpdateExpression: "SET #mods = :newModules",
    ExpressionAttributeNames: {
      "#mods": "modules"
    },
    ExpressionAttributeValues: { 
      ":newModules": modules,
    },
  };

  const dynamoResponse = await dynamoDBClient().update(params).promise();
  const response = dynamoResponse ? `Modules updated to ${userId} user` : null;

  return response;
};

const saveLogDynamo = async ({ log }) => {
  const params = {
    TableName: LOG_TABLE,
    Item: log
  };

  const dynamoResponse = await dynamoDBClient().put(params).promise();
  const response = dynamoResponse ? "Log Save" : null;

  return response;
};


module.exports = {
  getCompanies,
  getLastSession,
  updateLastSession,
  getModules,
  getUserModules,
  createUserModules,
  updateModulesPerUser,
  saveLogDynamo
};
