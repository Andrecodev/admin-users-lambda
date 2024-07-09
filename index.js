const { makeErrorResponse, makeOkResponse } = require("./models/response");

const validatorHandler = require("./middleware/validator");
const mainEventSchema = require("./middleware/schemas/event");

const { changeStatusUser, deleteUser, createUser, queryUserModules, updateUser } = require("./controllers/operationsToUser");
const { createUserAdmin , createGestor} = require("./controllers/operationsToUserTransversal");
const { queryUsers, validUser, dataForUser} = require("./controllers/queryUsers");
const { requestPasswordRecover , requestPasswordRecoverAdminUsers} = require("./controllers/passwordRecover");
const { requestChildrenKeys } = require("./controllers/commercialNetwork");
const { requestGetInfoKeys } = require("./controllers/keys");
const { requestcompaniesInfo } = require("./controllers/Companies");
const { requestChangePassword } = require("./controllers/changePassword");
const { requestGestorLogin } = require("./controllers/login/gestor");
const { requestLogin } = require("./controllers/login/login");
const { getSecretManager } = require("./utils/secret");
const { desCripto, enCripto } = require("./utils/DesCripto");


const unTokenizedHandler = async (evt, ctx, callback) => {
  console.log("evt -->",JSON.stringify(evt));
  console.log("ctx -->",JSON.stringify(ctx));
  const mainEventValidator = validatorHandler(mainEventSchema, evt);
  const isValidEvent = typeof mainEventValidator !== "object";
  if (!isValidEvent) {
    const validationError = JSON.stringify(mainEventValidator.details);
    return makeErrorResponse(`Incorrect body ${validationError}`, 422);
  }

  try {

    const secretToken = await getSecretManager();
    const notValidSecret = !secretToken || !secretToken.KEYDES;
    if (notValidSecret) throw Error(`Error secret ${secretToken}`);

    const KEYDES = secretToken.KEYDES;
    const KEYAPP = secretToken.KEYAPP;

    const { path, sourceIP = "0.0.0.0", body: { data: receivedData } } = evt;
    const pathName = path.lastIndexOf("/");
    const actionTaken = path.slice(pathName + 1);

    const isDataEncrypted = typeof receivedData === "string";
    const decryptedData = {
      [true]: () => JSON.parse(desCripto(receivedData, KEYDES)),
      [false]: () => receivedData,
    };
    const data = decryptedData[isDataEncrypted]();

    const services = {
      // Login services
      "login": async () => await requestLogin({ ...data, sourceIP }),
      "keys": async () => await requestChildrenKeys({ ...data, sourceIP }),
      "validate": async () => await requestGestorLogin({ ...data, sourceIP }),
      // Password services
      "recoveryPassword": async () => await requestPasswordRecover(data),
      "recoveryPasswordAdm": async () => await requestPasswordRecoverAdminUsers(data),
      "changePassword": async () => await requestChangePassword({ ...data, sourceIP }),
      // Admin users services
      "queryUsers": async () => await queryUsers({ ...data, sourceIP }),
      "dataForUser": async () => await dataForUser({ ...data, sourceIP }),
      "getUserModules": async () => await queryUserModules({ ...data, sourceIP }),
      "validUser": async () => await validUser({ ...data, sourceIP }),
      "createUser": async () => await createUser({ ...data, sourceIP }), 
      "updateUser": async () => await updateUser({ ...data, sourceIP }),
      "deleteUser": async () => await deleteUser({ ...data, sourceIP }),
      "changeStatusUser": async () => await changeStatusUser({ ...data, sourceIP }),
      // Transversal admin users services
      "createGestor": async () => await createGestor({ ...data, sourceIP }), 
      "crearAdm": async () => await createUserAdmin({ ...data, sourceIP }), 
      // utils for user
      "keysInfo": async () => await requestGetInfoKeys({ ...data, sourceIP }), 
      "CompaniesInfo": async () => await requestcompaniesInfo({ ...data, sourceIP }), 
    };

    const response = await services[actionTaken]();
    const stringResponse = JSON.stringify(response);
    console.log(`Response: ${stringResponse}`);

    if (response?.status?.code) return makeOkResponse(response);

    const allServices = { ...services };

    let adminEncryptedServices = Object.keys(allServices);
    const hasToEncryptResponse = adminEncryptedServices.includes(actionTaken);
    const isMandatoryEncrypted = ["login", "validate"].includes(actionTaken);
    const responseHasToBeEncrypted = isMandatoryEncrypted || (hasToEncryptResponse && isDataEncrypted);
    if (responseHasToBeEncrypted) {
      const encryptedResponse = enCripto(stringResponse, KEYAPP);

      return makeOkResponse(encryptedResponse);
    }
 
    return makeOkResponse(response);
  } catch (err) {
    const stringErr = `Error executing lambda: ${JSON.stringify(err)}`;
    const errorResponse = JSON.stringify(makeErrorResponse(stringErr, 500));
    console.log(errorResponse);
    // callback(errorResponse);

    return makeErrorResponse(err.message, 500);
  }
};

// Esto ya no es necesario, la seguridad está en el APIGateway
const TokenizedHandler = async (evt, ctx, callback) => {
  console.log("evt -->",JSON.stringify(evt));
  console.log("ctx -->",JSON.stringify(ctx));
  const mainEventValidator = validatorHandler(mainEventSchema, evt);
  const isValidEvent = typeof mainEventValidator !== "object";
  if (!isValidEvent) {
    const validationError = JSON.stringify(mainEventValidator.details);
    return makeErrorResponse(`Incorrect body ${validationError}`, 422);
  }

  try {
    const { path, body: { data } } = evt;
    const pathName = path.lastIndexOf("/");
    const actionTaken = path.slice(pathName + 1);
    console.log("actionTaken-->", actionTaken);
    console.log("actionTaken-->data-->", data);
    const services = {
      "login": async () => await requestLogin({ ...data }),
      "recoveryPassword": async () => await requestPasswordRecover(data),
      "keys": async () => await requestChildrenKeys({ ...data }),
      "validate": async () => await requestGestorLogin({ ...data }),
      // TODO: Eliminar funciones, estas van hacia la lambda tokenizada
      "newUserAdmin": async () => await createUserAdmin({ ...data }),
      "queryUsers": async () => await queryUsers({ ...data }),
      "validUser": async () => await validUser({ ...data }),
      "changeStatusUser": async () => await changeStatusUser({ ...data }),
      "createUserAdmin": async () => await createUserAdmin({ ...data }),
      "deleteUser": async () => await deleteUser({ ...data }),
      "createUser": async () => await createUser({ ...data }),
      "createAdmin": async () => await createUserAdmin({ ...data }), 
      "crearAdm": async () => await createUserAdmin({ ...data }), 
      "createGestor": async () => await createGestor({ ...data }),    
      "updateUser": async () => await updateUser({ ...data }),
      "getUserModules": async () => await queryUserModules({ ...data }),
      "changePassword": async () => await requestChangePassword({ ...data }),
    };

    const response = await services[actionTaken]();
    console.log(`Response: ${JSON.stringify(response)}`);

    return makeOkResponse(response);
  } catch (err) {
    console.log(JSON.stringify(err));
    //callback(JSON.stringify(err));

    return makeErrorResponse(err.message, 500);
  }
};

module.exports = {
  unTokenizedHandler,
  TokenizedHandler,
};
