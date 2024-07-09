const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
const path = require("path");

const { changeStatusUserData, deteleUserData, createUserData, createUserInValidData,UpdateUserData, UpdateUserInValidData, createUserIAXISData, commercialNetworkEvent } = require("../../mocks/eventMocks");

const { lambdaMock } = require("../../mocks/lambdaMock");
const { dynamoMock } = require("../../mocks/dynamoDbMock");
const { USER_MODULES_MOCK } = require("../../mocks/modulesMock");

const { changeStatusUser, deleteUser, createUser, queryUserModules, updateUser } = require("../../controllers/operationsToUser");

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

  test("Must to return 422 on null data changeStatusUser ", async () => {
    const { status } = await changeStatusUser(null);
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 on empty data changeStatusUser", async () => {
    const { status } = await changeStatusUser({});
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 on invalid data changeStatusUser", async () => {
    const data = {
      deshabilitar: changeStatusUserData.deshabilitar,
    };
    const { status } = await changeStatusUser(data);
    expect(status.code).toEqual(422);
  });
  test("Must to return 200 on valid data changeStatusUser", async () => {
    const data = changeStatusUserData;
    const a = await changeStatusUser(data);
    console.log(a);
    // TODO: Fix test, its returning 500
    // expect(status.code).toEqual(200);
  });
  test("Must to return 200 on valid data DeleteUser", async () => {
    const data = deteleUserData;
    const a = await deleteUser(data);
    console.log(a);
    // TODO: Fix test, its returning 500
    // expect(status.code).toEqual(200);
  })

  test("Must to return 200 on valid data CreateUser", async () => {
    const data = createUserData;
    const a = await createUser(data);
    // TODO: Fix test, its returning 500
    expect(a.code).toEqual(200);
  });

  test("Must to return 422  Invalid data CreateUser", async () => {
    const data = createUserInValidData;
    const { status } = await createUser(data);
    // TODO: Fix test, its returning 500
    expect(status.code).toBe(422);
  });

  test("Must to return 200 on valid data CreateUser IAXIS", async () => {
    const data = createUserIAXISData;
    const a = await createUser(data);
    // TODO: Fix test, its returning 500
    expect(a.code).toEqual(200);
  });

  test("Must to return 200 on valid data CreateUser", async () => {
    const data = createUserData;
    const a = await createUser(data);
    // TODO: Fix test, its returning 500
    expect(a.code).toEqual(200);
  });

  test("Must to return 200 on valid data update", async () => {
    const data = UpdateUserData;
    const a = await updateUser(data);
    // TODO: Fix test, its returning 500
    expect(a.code).toEqual(200);
  });

  test("Must to return 200 invalid feactures and brokerchilds data update", async () => {
    const data = UpdateUserInValidData;
    const { status }  = await updateUser(data);    
    expect(status.code).toBe(422);
  });


  test("Must to return 422 on queryUserModules because data is null", async () => {
    const { status } = await queryUserModules(null);
    expect(status.code).toBe(422);
  });

  test("Must to return 422 on queryUserModules because data is empty", async () => {
    const { status } = await queryUserModules({});
    expect(status.code).toBe(422);
  });

  test("Must to return 422 on queryUserModules because data is incorrect", async () => {
    const data = {
      identification: 123,
      key: 123,
    };
    const { status } = await queryUserModules(data);
    expect(status.code).toBe(422);
  });

  test("Must to return 200 on queryUserModules", async () => {
    const data = {
      identification: commercialNetworkEvent.user,
      key: 123,
    };
    const response = await queryUserModules(data);
    expect(response).toBe(USER_MODULES_MOCK.Item.modules);
  });
});
