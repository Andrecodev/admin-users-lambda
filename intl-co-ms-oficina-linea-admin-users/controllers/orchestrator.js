const AWS = require("aws-sdk");

const { ORCHESTRATOR_LAMBDA } = process.env;

const getDataFromOrchestrator = async ({ body, soapName, methodName }) => {
  try {
    const lambdaClient = new AWS.Lambda();
    const soapBody = {
      body,
      soapName,
      methodName,
    };
    const queryParams = {
      FunctionName: ORCHESTRATOR_LAMBDA,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        ...soapBody,
      }),

    };
    console.log("queryParams --> ", queryParams);
    const lambdaInvokeResp = await lambdaClient.invoke(queryParams).promise();
    console.log("lambdaInvokeResp --> ", lambdaInvokeResp);
    const lambdaResponse = JSON.parse(lambdaInvokeResp.Payload);
    const response = lambdaResponse && lambdaResponse.status.code === 200 ? lambdaResponse.data.infoResponse : null;
    return response.return ? response.return : response;
  } catch (err) {
    console.log(err);
    throw err;
  }

};

module.exports = getDataFromOrchestrator;
