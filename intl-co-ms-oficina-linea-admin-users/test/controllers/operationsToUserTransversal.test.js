const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
const path = require("path");

const {  createUserAdminData,createUserGestorData} = require("../../mocks/eventMocks");

const { lambdaMock } = require("../../mocks/lambdaMock");
const { dynamoMock } = require("../../mocks/dynamoDbMock");

const {  createUserAdmin , createUserGestor} = require("../../controllers/operationsToUserTransversal");

AWS.config.update({ region: process.env.REGION });
AWSMock.setSDK(path.resolve(__dirname, "../../node_modules/aws-sdk"));

describe("Operation revery controller tests", () => {

  beforeAll(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("Lambda", "invoke", (params, callback) => {
      const { Payload } = params;
      var lambdaResponse = ""
      const methodName = JSON.parse(Payload).methodName;
      if (methodName === undefined) {

        lambdaResponse = lambdaMock(params.FunctionName);
      } else {
        lambdaResponse = lambdaMock(methodName);
      }
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
    AWS.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  
  test("Must to return 200 on valid data create admin", async () => {
    const data = createUserAdminData;
    const a = await createUserAdmin(data);
    // TODO: Fix test, its returning 500
    expect(a.code).toEqual(200);
  });

  test("Must to return 200 on valid data create  gestor", async () => {
    const data = createUserGestorData;
    const a = await createUserGestor(data);
    // TODO: Fix test, its returning 500
    expect(a.code).toEqual(200);
  });


});
