const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk"); 
const path = require("path");

const { getBrokerChildrenInfo, getChildrenKeys } = require("../../utils/childrenInfo");
const { EXISTENT_BROKER } = require("../../mocks/brokerMock");
const { lambdaMock } = require("../../mocks/lambdaMock");

AWS.config.update({ region: process.env.REGION });
AWSMock.setSDK(path.resolve(__dirname, "../../node_modules/aws-sdk"));

describe("getChildren tests", () => {

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

  const { data: { brokerKey, businessName, childrenKeys } } = JSON.parse(EXISTENT_BROKER.Payload);
  let childKeys = [...childrenKeys];

  test("Must to return one item because has no children", async () => {
    const childrenInfo = await getBrokerChildrenInfo({ childrenKeys: childKeys, brokerKey, businessName });
    expect(childrenInfo).toHaveLength(1);
  });

  test("Must to return one item, even when has children, but, date is not valid", async () => {
    childKeys = [...childrenKeys, 456, 789];
    const childrenInfo = await getBrokerChildrenInfo({ childrenKeys: childKeys, brokerKey, businessName });
    expect(childrenInfo).toHaveLength(1);
  });

  test("Must to return legalRepresentative and socialReason childrenInfo keys", async () => {
    const childrenInfo = await getChildrenKeys({ childrenKeys: childKeys });
    expect(childrenInfo).toHaveLength(childKeys.length);
  });

  test("Must to return empty array because has no children keys", async () => {
    const childrenInfo = await getChildrenKeys({ childrenKeys: [] });
    expect(childrenInfo).toHaveLength(0);
  });

  test("Must to return one item and do not have parentKey key on result", async () => {
    const childrenInfo = await getChildrenKeys({ childrenKeys: [123] });
    expect(childrenInfo).toHaveLength(1);
    expect(Object.keys(childrenInfo[0])).toHaveLength(5);
  });

  test("Must to return one item and have parentKey key on result", async () => {
    const childrenInfo = await getChildrenKeys({ childrenKeys: [1] });
    expect(childrenInfo).toHaveLength(1);
    expect(Object.keys(childrenInfo[0])).toHaveLength(6);
  });
});
