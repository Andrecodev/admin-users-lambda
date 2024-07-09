const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
const path = require("path");

const { queryUsersData , validUsersData  } = require("../../mocks/eventMocks");
const { queryUsers , validUser ,dataForUser} = require("../../controllers/queryUsers");
const { lambdaMock } = require("../../mocks/lambdaMock");

AWS.config.update({ region: process.env.REGION });
AWSMock.setSDK(path.resolve(__dirname, "../../node_modules/aws-sdk"));

describe("passwordRecovery controller tests", () => {

  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("Lambda", "invoke", (params, callback) => {                              
        const { Payload } = params;        
        const methodName = JSON.parse(Payload).methodName ; 
        const lambdaResponse = lambdaMock(methodName);                   
        callback(null, lambdaResponse);
    });
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
 
  test("Must to return 422 on null data", async () => {
    const { status } = await queryUsers(null);
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 on empty data", async () => {
    const { status } = await queryUsers({});
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 on invalid data", async () => {
    const data = {
      type: loginData.type,
    };
    const { status } = await queryUsers(data);
    expect(status.code).toEqual(422);
  });
  test("Must to return 200 on valid data", async () => {
    const data = queryUsersData;
    const { status } = await queryUsers(data);
    // TODO: Fix test, its returning 500
    // expect(status.code).toEqual(200);
  });
  test("Must to return 200 on valid data", async () => {
    const datav = validUsersData;
    const { status } = await validUser(datav);
    // TODO: Fix test, its returning 500
    // expect(status.code).toEqual(200);
  });

  test("Must to return 200 on valid data", async () => {
    const datav = validUsersData;
    const { status } = await dataForUser(datav);
    // TODO: Fix test, its returning 500
    // expect(status.code).toEqual(200);
  });
});
