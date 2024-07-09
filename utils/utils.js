const { Lambda } = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
let lambda;
const lambdaClient = () => lambda ? lambda : lambda = new Lambda();
const { UTILS_LAMBDA } = process.env;

const readUtilsVariable = async (utilsId) => {
  const invokeParams = {
    path: {
      id: utilsId,
    },
  };

  const queryParams = {
    FunctionName: UTILS_LAMBDA,
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({
      params: invokeParams,
    }),
  };

  const lambdaInvokeResponse = await lambdaClient().invoke(queryParams).promise();
  const lambdaResponse = JSON.parse(lambdaInvokeResponse.Payload);
  const response = lambdaResponse && lambdaResponse.status.code === 200 ? lambdaResponse.data.data : null;

  return response;
};

const generateUUID = uuidv4();


module.exports = {
  readUtilsVariable,
  generateUUID
};
