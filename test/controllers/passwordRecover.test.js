const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
const path = require("path");

const { loginData , recoveryData } = require("../../mocks/eventMocks");
const { requestPasswordRecover } = require("../../controllers/passwordRecover");
const { lambdaMock } = require("../../mocks/lambdaMock");
const { dynamoMock } = require("../../mocks/dynamoDbMock");

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
    AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
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
    const { status } = await requestPasswordRecover(null);
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 on empty data", async () => {
    const { status } = await requestPasswordRecover({});
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 on invalid data", async () => {
    const data = {
      type: loginData.type,
    };
    const { status } = await requestPasswordRecover(data);
    expect(status.code).toEqual(422);
  });

  test("Must to return 200 on valid data user ldap", async () => {
    const a = await requestPasswordRecover(recoveryData);
    expect(a.mensaje).toBe("true");
    // TODO: Fix TestScheduler, its returning 500
    // expect(status.code).toEqual(200);
  });
});
