const { OK_RESPONSE_TEMPLATE } = require("../models/response-templates");

const CHILDREN_KEYS_PER_USER = {
  Payload: JSON.stringify({
    ...OK_RESPONSE_TEMPLATE,
    data: {
      infoResponse: {
        "soapenv:Envelope": {
          "soapenv:Body": {
            "ns3:consultarRedComercialPorUsuarioRs": {
              "redComercialU": [
                {
                  "claveIntermediario": {
                      "value": "-1",
                  },
                },
                {
                  "claveIntermediario": {
                      "value": "2",
                  },
                },
                {
                  "claveIntermediario": {
                      "value": "3999999",
                  },
                },
                {
                  "claveIntermediario": {
                      "value": "4000001",
                  },
                },
                {
                  "claveIntermediario": {
                      "value": "4999999",
                  },
                },
                {
                  "claveIntermediario": {
                      "value": "5000000",
                  },
                },
              ]
            },
          },
        },
      },
    },
  }),
};

module.exports = {
  CHILDREN_KEYS_PER_USER,
};
