const { config } = require("aws-sdk");
const AWS = require("aws-sdk-mock");
const path = require("path");

const { dynamoMock } = require("../../mocks/dynamoDbMock");
const { getCompaniesInfo } = require("../../utils/companiesInfo");

config.update({ region: process.env.REGION });
AWS.setSDK(path.resolve(__dirname, "../../node_modules/aws-sdk"));

describe("getCompaniesInfo tests", () => {
  beforeAll(() => {
    AWS.mock("DynamoDB.DocumentClient", "scan", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });
  });

  afterAll(() => {
    AWS.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("Must to return Items", async () => {
    const response = await getCompaniesInfo();
    expect(response).toHaveLength(3);
  });
});
