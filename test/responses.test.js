const { makeOkResponse, makeErrorResponse } = require("../models/response");
const { OK_RESPONSE_TEMPLATE } = require("../models/response-templates");

describe("Responses tests", () => {
  test("makeOkResponse", () => {
    const response = {
      ...OK_RESPONSE_TEMPLATE,
      data: "OK",
    };
    const func = makeOkResponse("OK");
    expect(func).toEqual(response);
  });

  test("makeErrorResponse", () => {
    const response = {
      status: {
        code: 422,
        details: "Error",
      },
    };
    const func = makeErrorResponse("Error", 422);
    expect(func).toEqual(response);
  });
});
