const { gestorSchema } = require("../../middleware/schemas/login");
const validatorHandler = require("../../middleware/validator");
const { makeErrorResponse } = require("../../models/response");
const { removeTokenFromRedis } = require("../../utils/token");
const { getInfoToLogin } = require("./login");

const requestGestorLogin = async (data) => {
  const loginValidator = validatorHandler(gestorSchema, data);
  const isValid = typeof loginValidator !== "object";

  if (!isValid) {
    const validationError = JSON.stringify(loginValidator.details);
    return makeErrorResponse(`Incorrect gestorLogin body ${validationError}`, 422);
  }

  try {
    const { user, brokerKey, sourceIP } = data;
    const usuarioId = data.user.numeroid;
    const { currentToken } = user;
    const tokenDeletion = await removeTokenFromRedis(currentToken);
    console.log(`First gestor token deletion successful: ${JSON.stringify(tokenDeletion)}`);
    const response = await getInfoToLogin({ user, brokerId: brokerKey, numberIdLogin: usuarioId, sourceIP, deleteToken: true });

    return response;
  } catch (err) {
    console.log(JSON.stringify(err));

    return makeErrorResponse(err.message, 500);
  }
};

module.exports = {
  requestGestorLogin,
};
