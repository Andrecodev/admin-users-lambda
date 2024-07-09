const { ERROR_RESPONSE_TEMPLATE, OK_RESPONSE_TEMPLATE } = require("./response-templates");

/**
 * This function creates the status response of body's response
 * @param {*} details text to return
 * @param {*} statusCode status code to return in status.code
 */
function makeErrorResponse(details, statusCode) {
  let response = { ...ERROR_RESPONSE_TEMPLATE };
  response.status.details = details;
  response.status.code = statusCode;
  return response;
};

/**
 * This function creates the status response of body's response
 * @param {*} data request body to return
 */
function makeOkResponse (data) { 
  return { ...OK_RESPONSE_TEMPLATE, data };
};

module.exports = {
  makeErrorResponse,
  makeOkResponse
};
