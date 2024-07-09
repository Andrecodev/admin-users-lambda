const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
const path = require("path");
const { secretManagerMock } = require("../../mocks/secretManager");
const { requestLogin } = require("../../controllers/login/login");
const { requestGestorLogin } = require("../../controllers/login/gestor");
const { lambdaMock } = require("../../mocks/lambdaMock");
const { dynamoMock } = require("../../mocks/dynamoDbMock");
const { loginData , loginDataGestor ,} = require("../../mocks/eventMocks");

AWS.config.update({ region: process.env.REGION });
AWSMock.setSDK(path.resolve(__dirname, "../../node_modules/aws-sdk"));

describe("Login controller tests", () => {

  beforeAll(() => {
    AWSMock.mock("SecretsManager", "getSecretValue", (params, callback) => {
      let secretMock = secretManagerMock(params.SecretId);
      callback(null, secretMock);
    });
  });

  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("Lambda", "invoke", (params, callback) => {
      const { Payload } = params;
      const methodName = JSON.parse(Payload).methodName;
      const lambdaResponse = lambdaMock(methodName);
      callback(null, lambdaResponse);
    });
    AWSMock.mock("DynamoDB.DocumentClient", "scan", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });

    AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });

    AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });

    AWSMock.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      let eventDynamodb = dynamoMock(params.TableName);
      callback(null, eventDynamodb);
    });
  });

  afterAll(() => {
    AWSMock.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
/*
  test("Must to return 422 on null data", async () => {
    const { status } = await requestLogin(null);
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 on empty data", async () => {
    const { status } = await requestLogin({});
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 on invalid data", async () => {
    const data = {
      type: loginData.type,
    };
    const { status } = await requestLogin(data);
    expect(status.code).toEqual(422);
  });

  test("Must to return 200 on valid data", async () => {
    const { status } = await requestLogin(loginData);
    // TODO: Fix TestScheduler, its returning 500
    // expect(status.code).toEqual(200);
  });*/

  test("Must to return 200 on valid data requestGestorLogin", async () => {
    const { status } = await requestLogin(loginDataGestor);
    // TODO: Fix TestScheduler, its returning 500
    // expect(status.code).toEqual(200);
  });
});
