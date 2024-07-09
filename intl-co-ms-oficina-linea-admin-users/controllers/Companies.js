const { makeErrorResponse } = require("../models/response");
const { getCompaniesInfo } = require("../utils/companiesInfo");
const requestcompaniesInfo = async (data) => {
  try {
    const companiesInfo = await getCompaniesInfo();
    return companiesInfo;
  } catch (err) {
    const errMessage = `Error getting companiesInfo : ${JSON.stringify(err)}`;
    console.log(errMessage);
    return makeErrorResponse(errMessage, 500);
  }
};

module.exports = {
    requestcompaniesInfo,
};
