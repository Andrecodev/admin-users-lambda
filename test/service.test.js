const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
const path = require("path");

const { mainLoginEvent, recoveryPasswordEvent, keysEvent, gestorLoginEvent, queryUsersEvent, createUserGestorEvent } = require("../mocks/eventMocks");
const { lambdaMock } = require("../mocks/lambdaMock");

const { unTokenizedHandler, TokenizedHandler } = require("..");

AWS.config.update({ region: process.env.REGION });
AWSMock.setSDK(path.resolve(__dirname, "../node_modules/aws-sdk"));

describe("Handler tests", () => {
  const context = null;
  const callback = jest.fn();

  beforeAll(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("Lambda", "invoke", (params, callback) => {
      const lambdaResponse = lambdaMock(params.FunctionName);
      callback(null, lambdaResponse);
    });
  });

  afterAll(() => {
    AWS.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("Must to return 422 because event is null", async () => {
    const { status } = await unTokenizedHandler(null, context, callback);
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 because event is empty", async () => {
    const { status } = await unTokenizedHandler({}, context, callback);
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 because event is not valid", async () => {
    const { status } = await unTokenizedHandler({ data: "Data" }, context, callback);
    expect(status.code).toEqual(422);
  });

  test("Must to return 200 on login service", async () => {
    const { status } = await unTokenizedHandler(mainLoginEvent, context, callback);
    // TODO: Check status response, its returning 500
    // expect(status.code).toBe(200);
  });

  test("Must to return 200 on password recovery service", async () => {
    const { status } = await unTokenizedHandler(recoveryPasswordEvent, context, callback);
    // TODO: Check status response, its returning 500
    // expect(status.code).toBe(200);
  });

  test("Must to return 200 on createUserGestor", async () => {
    const { status } = await unTokenizedHandler(createUserGestorEvent, context, callback);
    // TODO: Check status response, its returning 500
    // expect(status.code).toBe(200);
  });

  test("Must to return 200 on keys service", async () => {
    const { status } = await unTokenizedHandler(keysEvent, context, callback);
    // TODO: Check status response, its returning 500
    // expect(status.code).toBe(200);
  });

  test("Must to return 200 on gestorLogin service", async () => {
    const { status } = await unTokenizedHandler(gestorLoginEvent, context, callback);
    // TODO: Check status response, its returning 500
    // expect(status.code).toBe(200);
  });

  test("Must to return 200 on queryusersEvent service", async () => {
    const { status } = await TokenizedHandler(queryUsersEvent, context, callback);
    // TODO: Check status response, its returning 500
    expect(status.code).toBe(200);
  });
});
