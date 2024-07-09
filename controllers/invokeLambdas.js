const AWS = require("aws-sdk");

const { QUERY_INTERM, REDIS_LAMBDA } = process.env;

const getBroker = async (brokerKey) => {
  const lambdaClient = new AWS.Lambda();
  const params = {
    FunctionName: QUERY_INTERM,
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({ brokerKey }),
  };
 // console.log('getBroker')
 // console.log(params)
  const lambdaInvokeResp = await lambdaClient.invoke(params).promise();
 // console.log(lambdaInvokeResp)
  const lambdaRespParsed = JSON.parse(lambdaInvokeResp.Payload);
 // console.log(lambdaRespParsed)
  const response = lambdaRespParsed.status && lambdaRespParsed.status.code === 200 ? lambdaRespParsed.data : null;
 // console.log(response)
  return response;
};

const saveToken = async (data, body, expiration) => {
  const lambdaClient = new AWS.Lambda();
  const payload = JSON.stringify({
    method: "POST",
    payload: {
      key: data,
      value: body,
      expires: expiration,
    },
  });

  const params = {
    FunctionName: REDIS_LAMBDA,
    InvocationType: "RequestResponse",
    Payload: payload,
  };

  const lambdaInvokeResp = await lambdaClient.invoke(params).promise();
  const lambdaRespParsed = JSON.parse(lambdaInvokeResp.Payload);
  const response = lambdaRespParsed.statusCode === 200 ? lambdaRespParsed.body : null;

  return response;
};

const deleteToken = async (token) => {
  const lambdaClient = new AWS.Lambda();
  const payload = JSON.stringify({
    method: "DELETE",
    payload: {
      key: token,
    },
  });

  const params = {
    FunctionName: REDIS_LAMBDA,
    InvocationType: "RequestResponse",
    Payload: payload,
  };

  const lambdaInvokeResp = await lambdaClient.invoke(params).promise();
  const lambdaRespParsed = JSON.parse(lambdaInvokeResp.Payload);
  const response = lambdaRespParsed.statusCode === 200 ? lambdaRespParsed.body : null;

  return response;
}

module.exports = {
  getBroker,
  saveToken,
  deleteToken,
};
