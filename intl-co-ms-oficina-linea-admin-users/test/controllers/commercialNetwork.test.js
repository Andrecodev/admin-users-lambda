const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk"); 
const path = require("path");

const { lambdaMock } = require("../../mocks/lambdaMock");
const { commercialNetworkEvent } = require("../../mocks/eventMocks");
const { getUsuarioGestorRedComercialRequestDTO } = require("../../models/login/dtos");

const { requestChildrenKeys } = require("../../controllers/commercialNetwork");

AWS.config.update({ region: process.env.REGION });
AWSMock.setSDK(path.resolve(__dirname, "../../node_modules/aws-sdk"));

describe("commercialNetwork tests", () => {

  beforeAll(() => AWSMock.setSDKInstance(AWS));

  afterEach(() => {
    AWSMock.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("Must to return 422 because data is null", async () => {
    const { status } = await requestChildrenKeys(null);
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 because data is empty", async () => {
    const { status } = await requestChildrenKeys({});
    expect(status.code).toEqual(422);
  });

  test("Must to return 422 because data is incorrect", async () => {
    const { status } = await requestChildrenKeys({ user: 123 });
    expect(status.code).toEqual(422);
  });

  test("Must to get correct body to soap request", () => {
    const { user } = commercialNetworkEvent;
    const { envelope } = getUsuarioGestorRedComercialRequestDTO(commercialNetworkEvent);
    expect(envelope).toMatch(`<usuario>${user}</usuario>`);
    expect(envelope).toMatch("</consultarRedComercialPorUsuarioRq>");
  });

  test("Must to return an array with one children key", async () => {
    AWSMock.mock("Lambda", "invoke", (params, callback) => {
      const methodName = JSON.parse(params.Payload).methodName;
      const lambdaResponse = lambdaMock(methodName);
      callback(null, lambdaResponse);
    });
    const response = await requestChildrenKeys(commercialNetworkEvent);
    expect(response).toEqual([1, 999999]);
  });

  test("Must to return an array with one children key information", async () => {
    AWSMock.mock("Lambda", "invoke", (params, callback) => {
      const lambdaResponse = lambdaMock(params.FunctionName);
      callback(null, lambdaResponse);
    });
    const event = {
      ...commercialNetworkEvent,
      selectedKey: "123"
    }
    const response = await requestChildrenKeys(event);
    expect(response).toHaveLength(1);
  });
});
