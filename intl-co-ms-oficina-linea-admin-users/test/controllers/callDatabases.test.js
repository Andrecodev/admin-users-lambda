const { config } = require("aws-sdk");
const AWS = require("aws-sdk-mock");
const path = require("path");

const { dynamoMock } = require("../../mocks/dynamoDbMock");
const { commercialNetworkEvent } = require("../../mocks/eventMocks");
const { MODULES_MOCK, USER_MODULES_MOCK } = require("../../mocks/modulesMock");

const { getModules, getUserModules, getCompanies, createUserModules, updateModulesPerUser, updateLastSession, getLastSession } = require("../../controllers/callDatabases");
const { COMPANIES_DYNAMO_RESPONSE } = require("../../mocks/companiesMock");
const { LOGIN_SESSION_MOCK } = require("../../mocks/loginTableMock");

config.update({ region: process.env.REGION });
AWS.setSDK(path.resolve(__dirname, "../../node_modules/aws-sdk"));

describe("Databases tests", () => {
  const userId = commercialNetworkEvent.user;

  beforeAll(() => {
    AWS.mock("DynamoDB.DocumentClient", "scan", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });

    AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });

    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });

    AWS.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });
  });

  afterAll(() => {
    AWS.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("Must to return all companies", async () => {
    const response = await getCompanies();
    expect(response.Items).toHaveLength(COMPANIES_DYNAMO_RESPONSE.Items.length);
  });

  test("Must to return last session of an user", async () => {
    const response = await getLastSession(userId);
    expect(response).toEqual(LOGIN_SESSION_MOCK.Item);
  });

  test("Must to update last session of an user", async () => {
    const response = await updateLastSession(userId);
    expect(response).toEqual("OK");
  });

  test("Must to return all modules on database call", async () => {
    const response = await getModules();
    expect(response).toHaveLength(MODULES_MOCK.Items.length);
  });

  test("Must to return all user modules on database call", async () => {
    const response = await getUserModules(userId);
    expect(response.modules).toHaveLength(USER_MODULES_MOCK.Item.modules.length);
  });

  test("Must to return OK on create user modules", async () => {
    const event = {
      userId,
      modules: ["Test 1", "Test 2"],
    };

    const response = await createUserModules(event);
    expect(response).toEqual(`Modules added to ${commercialNetworkEvent.user} user`);
  });

  test("Must to return OK on update user modules", async () => {
    const event = {
      userId,
      modules: ["Test 1", "Test 3"],
    };

    const response = await updateModulesPerUser(event);
    expect(response).toEqual(`Modules updated to ${commercialNetworkEvent.user} user`);
  });
});
