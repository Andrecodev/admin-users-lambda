const AWS = require("aws-sdk");
const { region, SM_AUTH } = require("../constants/token");

const getSecretManager = async () => {
  try {
    let secretResponse = await new AWS.SecretsManager({ region })
      .getSecretValue({ SecretId: SM_AUTH }, async (err, data) => { }).promise();
    let isSecretManager = JSON.parse(secretResponse.SecretString);

    return isSecretManager;
  } catch (error) {
    console.log(`Error secretManager: ${error}`);
    return { "description": `error: ${error}` };
  }
};

module.exports = {
  getSecretManager,
};
