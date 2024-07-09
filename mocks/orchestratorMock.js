const { OK_RESPONSE_TEMPLATE } = require("../models/response-templates");

const ORCHESTRATOR_RESPONSE = {
  "StatusCode": 200,
  "ExecutedVersion": "$LATEST",
  "Payload": JSON.stringify({
    ...OK_RESPONSE_TEMPLATE,
    data: {
      infoResponse: {
        infoResponse: {
          user: "User Test",
        },
      },
    },
  })
};

module.exports = {
  ORCHESTRATOR_RESPONSE,
};
