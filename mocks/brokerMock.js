const { OK_RESPONSE_TEMPLATE } = require("../models/response-templates");

const EXISTENT_BROKER = {
  Payload: JSON.stringify({
    ...OK_RESPONSE_TEMPLATE,
    data: {
      brokerKey: 123,
      officeCode: 1,
      city: "CITY",
      departmentCode: 11,
      leavingDate: 950072400000,
      nitNumber: "123456",
      businessName: "BUSINESS NAME",
      childrenKeys: [123],
      socialReason: "SOCIAL REASON",
      legalRepresentative: "LEGAL REPRESENTATIVE",
      parentKey: 1,
      office: "OFFICE",
      personType: "N",
    },
  }),
};

module.exports = {
  EXISTENT_BROKER,
};
