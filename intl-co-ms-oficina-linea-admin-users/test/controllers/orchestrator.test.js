const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk"); 
const path = require("path");

const { VALIDAR_EXISTENCIA_USUARIO_LDAP } = require("../../mocks/LDAPMock");
const { lambdaMock } = require("../../mocks/lambdaMock");
const { soapEvent } = require("../../mocks/eventMocks");

const getDataFromOrchestrator = require("../../controllers/orchestrator");

AWS.config.update({ region: process.env.REGION });
AWSMock.setSDK(path.resolve(__dirname, "../../node_modules/aws-sdk"));

describe("Orchestrator controller tests", () => {
  
  beforeAll(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("Lambda", "invoke", (params, callback) => {
      const methodName = JSON.parse(params.Payload).methodName;
      const lambdaResponse = lambdaMock(methodName);
      callback(null, lambdaResponse);
    });
  });

  afterAll(() => {
    AWS.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("Must to return response", async () => {
    const response = await getDataFromOrchestrator(soapEvent);
    const expected = JSON.parse(VALIDAR_EXISTENCIA_USUARIO_LDAP.Payload).data.infoResponse;
    expect(response).toEqual(expected);
  });
});
