// crypto module
const crypto = require("crypto");

const decypherAlgorithm = "aes-256-ecb";
const cypherAlgorithm = "aes-128-ecb";

const desCripto = (data, key) => {
  const decipher = crypto.createDecipheriv(decypherAlgorithm, key, null);
  let decryptedData = decipher.update(data, "base64", "utf-8");
  decryptedData += decipher.final("utf8");

  return decryptedData;
};

const enCripto = (data, key) => {
  const cipher = crypto.createCipheriv(cypherAlgorithm, key, null);
  let encryptedData = cipher.update(data, "utf-8", "base64");
  encryptedData += cipher.final("base64");
  
  return encryptedData;
}
module.exports = {
  desCripto,
  enCripto,
};
