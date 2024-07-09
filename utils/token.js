const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { sign } = require("jsonwebtoken");

dayjs.extend(utc);

const { saveToken, deleteToken } = require("../controllers/invokeLambdas");
const { EXPIRATION_TOKEN_ACCESS } = require("../constants/token");
const { makeErrorResponse } = require("../models/response");
const { readUtilsVariable } = require("./utils");
const { getSecretManager } = require("./secret");

const getStringfromObject = (data) => {
  let dataToTokenizer = [];
  const keys = Object.keys(data);
  keys.forEach(key => dataToTokenizer.push(`${key}=${data[key]}`));
  const chainedInfo = dataToTokenizer.join("&");

  return chainedInfo;
};

/**
 * Generates a JSON Web Token (JWT) given some data
 * 
 * @param {*} infoJwt data to convert to JWT
 * 
 */
const generateJsonWebToken = async (infoJwt, JWT_pass_decrypted) => {
  const jwtToken = sign(
    infoJwt,
    JWT_pass_decrypted,
    { expiresIn: "10m" }
  );

  return jwtToken;
};

const getTokenAccessExpiration = async () => {
  try {
    const tokenAccessExpiration = await readUtilsVariable(EXPIRATION_TOKEN_ACCESS);
    const tokenAccessExpirationType = typeof tokenAccessExpiration;
    const validTypes = ["string", "number"];
    const notValidTokenAccess = !validTypes.includes(tokenAccessExpirationType);
    if (notValidTokenAccess) return makeErrorResponse(`Invalid variable token access expiration: ${tokenAccessExpirationType}`, 500);
  
    return tokenAccessExpiration;
  } catch (err) {
    const errResponse = `Error getting token access expiration: ${JSON.stringify(err)}`;
    console.log(errResponse);
    return makeErrorResponse(errResponse, 500);
  }
};

const getTokenInformation = async (info) => {
  try {
    const secretToken = await getSecretManager();
    const notValidSecret = !secretToken || !secretToken.STRING;
    if (notValidSecret) throw Error(`Error secret ${secretToken}`);

    const SECRET_STRING = secretToken.STRING;
    const tokenAccessExpiration = await getTokenAccessExpiration();
    const timeoutMoment = dayjs.utc().add(parseInt(tokenAccessExpiration, 10), "s");
    const timeout = timeoutMoment.valueOf();
    const accessToken  = await generateJsonWebToken(info, SECRET_STRING);
    const refreshToken = await generateJsonWebToken({ user: info, timeout }, SECRET_STRING);
    console.log("OK: Success and Refresh Token generation");

    const data = getStringfromObject(info);    
    await saveTokens({
      data,
      timeout,
      tokenExpiration: tokenAccessExpiration,
      accessToken,
      refreshToken,
    });

    return { timeout, accessToken, refreshToken };  
  } catch (err) {
    const errResponse = `Error getting tokens: ${JSON.stringify(err)}`;
    console.log(errResponse);
    return makeErrorResponse(errResponse, 500);
  }  
};

const saveTokens = async ({ data, timeout, tokenExpiration, accessToken, refreshToken }) => {
  try {
    const accessTokenBody = JSON.stringify({ accessToken, timeout });
    const refreshTokenBody = JSON.stringify({ refreshToken, timeout });
    const saveAccessToken = await saveToken(data, accessTokenBody, tokenExpiration);
    const saveRefreshToken = await saveToken(accessToken, refreshTokenBody, tokenExpiration);

    if (saveAccessToken === null || saveRefreshToken === null) {
      throw Error("Problems storing access and refresh tokens");
    }

  } catch (err) {
    const errResponse = `Problems storing access and refresh tokens: ${JSON.stringify(err)}`;
    console.log(errResponse);
    return makeErrorResponse(errResponse, 500);
  }
};

const removeTokenFromRedis = async (token) => {
  try {
    const tokenDeletion = await deleteToken(token);
    
    return tokenDeletion;
  } catch (err) {
    const errResponse = `Problems deleting current token: ${JSON.stringify(err)}`;
    console.log(errResponse);
    return makeErrorResponse(errResponse, 500);
  }
};

module.exports = {
  getStringfromObject,
  generateJsonWebToken,
  getTokenAccessExpiration,
  getTokenInformation,
  removeTokenFromRedis,
};
