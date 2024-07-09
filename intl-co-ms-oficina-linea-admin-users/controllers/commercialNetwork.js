const commercialNetworkSchema = require("../middleware/schemas/commercialNetwork");
const validatorHandler = require("../middleware/validator");
const { makeErrorResponse } = require("../models/response");

const { convertObjectKeysIntoArrayKeys, cleanKeys } = require("../utils/parsers");
const { getChildrenKeys } = require("../utils/childrenInfo");

const { COMMERCIAL_NETWORK_NAME, CONSULT_PER_USER } = require("../constants/soapOrchestrator");
const { getUsuarioGestorRedComercialRequestDTO } = require("../models/login/dtos");
const getDataFromOrchestrator = require("./orchestrator");

const requestChildrenKeys = async (data) => {
  const commercialValidator = validatorHandler(commercialNetworkSchema, data);
  const isValid = typeof commercialValidator !== "object";

  if (!isValid) {
    const validationError = JSON.stringify(commercialValidator.details);
    return makeErrorResponse(`Incorrect commercialNetwork body ${validationError}`, 422);
  }

  try {
    console.log("data?.user -->",data);
    if (data?.selectedKey) {
      const keyInfo = await getChildrenKeys({ childrenKeys: [Number(data?.selectedKey)] });
      return keyInfo;
    }
    console.log("data?.user -->",data?.user);
    const soapBody = getUsuarioGestorRedComercialRequestDTO({ user: data?.user, ip: data?.sourceIP });

    const response = await getDataFromOrchestrator({
      soapName: COMMERCIAL_NETWORK_NAME,
      methodName: CONSULT_PER_USER,
      body: soapBody,
    });

    const keys = response?.["soapenv:Envelope"]?.["soapenv:Body"]?.["ns3:consultarRedComercialPorUsuarioRs"]?.["redComercialU"];

    const childrenKeys = convertObjectKeysIntoArrayKeys(keys);
    const cleanedKeys = cleanKeys(childrenKeys);

    return cleanedKeys;
  } catch (err) {
    const errMessage = `Error getting keys from ${data?.user}: ${JSON.stringify(err)}`;
    console.log(errMessage);

    return makeErrorResponse(errMessage, 500);
  }
};

module.exports = {
  requestChildrenKeys,
};
