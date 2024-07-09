const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
const path = require("path");
const { requestcompaniesInfo } = require("../../controllers/Companies");
const { lambdaMock } = require("../../mocks/lambdaMock");
const { KeyEvent } = require("../../mocks/eventMocks");
const { dynamoMock } = require("../../mocks/dynamoDbMock");
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

    });

    afterAll(() => {
        AWSMock.restore();
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });


    test("Must to return array length > 1 and first item contains businessName on valid data requestGetInfoKeys", async () => {
        const data = await requestcompaniesInfo({});
        expect(data.length).toBeGreaterThan(0);
        expect(data[0].companyNameCode).toEqual("Alfa 5");
    });


});
