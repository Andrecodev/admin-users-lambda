const { config } = require("aws-sdk");
const AWS = require("aws-sdk-mock");
const path = require("path");

const { dynamoMock } = require("../../mocks/dynamoDbMock");
const { VALID_MODULES_MOCK } = require("../../mocks/modulesMock");
const { commercialNetworkEvent } = require("../../mocks/eventMocks");

const { getModulesToRender } = require("../../utils/modulesInfo");

config.update({ region: process.env.REGION });
AWS.setSDK(path.resolve(__dirname, "../../node_modules/aws-sdk"));

describe("Modules tests", () => {
  beforeAll(() => {
    AWS.mock("DynamoDB.DocumentClient", "scan", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });

    AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });
  });

  afterAll(() => {
    AWS.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("Must to return user modules filtered", async () => {
    const userId = commercialNetworkEvent.user;
    const response = await getModulesToRender(userId);
    expect(response).toEqual(VALID_MODULES_MOCK);
  });
});
