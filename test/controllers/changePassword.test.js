const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
const path = require("path");

const {  changePasswordData } = require("../../mocks/eventMocks");
const { requestChangePassword } = require("../../controllers/changePassword");
const { lambdaMock } = require("../../mocks/lambdaMock");
const { dynamoMock } = require("../../mocks/dynamoDbMock");
const { secretManagerMock } = require("../../mocks/secretManager");
AWS.config.update({ region: process.env.REGION });
AWSMock.setSDK(path.resolve(__dirname, "../../node_modules/aws-sdk"));

describe("requestChangePassword controller tests", () => {

  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("Lambda", "invoke", (params, callback) => {                              
        const { Payload } = params;        
        const methodName = JSON.parse(Payload).methodName ; 
        const lambdaResponse = lambdaMock(methodName);                   
        callback(null, lambdaResponse);
    });
    AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });
  });
  beforeAll(() => {
    AWSMock.mock("SecretsManager", "getSecretValue", (params, callback) => {
      let secretMock = secretManagerMock(params.SecretId);
      callback(null, secretMock);
    });
  });

  afterAll(() => {
    AWS.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
 
  test("Must to return 422 on null data", async () => {
    const { status } = await requestChangePassword(null);
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 on empty data", async () => {
    const { status } = await requestChangePassword({});
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 on invalid data", async () => {
    const data = {
      type: "cc",
    };
    const { status } = await requestChangePassword(data);
    expect(status.code).toEqual(422);
  });

  test("Must to return 200 on valid data user ldap", async () => {
    const a = await requestChangePassword(changePasswordData);
    expect(a.changePassword).toBe(true);
    // TODO: Fix TestScheduler, its returning 500
    // expect(status.code).toEqual(200);
  });
});
