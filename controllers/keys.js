const keySchemaSchema = require("../middleware/schemas/key");
const validatorHandler = require("../middleware/validator");
const { makeErrorResponse } = require("../models/response");
const { getBroker } = require("./invokeLambdas");
const { getBrokerChildrenInfo } = require("../utils/childrenInfo");

const requestGetInfoKeys = async (data) => {
  const keyValidator = validatorHandler(keySchemaSchema, data);
  const isValid = typeof keyValidator !== "object";

  if (!isValid) {
    const validationError = JSON.stringify(keyValidator.details);
    return makeErrorResponse(`Incorrect keySchema body ${validationError}`, 422);
  }

  try {
    const brokerInfo = await getBroker(data.Broker);
    const { childrenKeys, brokerKey, businessName } = brokerInfo;
    console.log(childrenKeys)
    const childrenInfo =await getBrokerChildrenInfo({ childrenKeys, brokerKey, businessName });
    return childrenInfo;
  } catch (err) {
    const errMessage = `Error getting keys from ${data.Broker}: ${JSON.stringify(err)}`;
    console.log(errMessage);

    return makeErrorResponse(errMessage, 500);
  }
};

module.exports = {
  requestGetInfoKeys,
};
