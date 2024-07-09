const { MODULES } = require("../../constants/modules");
const { setDataToTokenizer } = require("../../controllers/login/login");
const { getStringfromObject } = require("../../utils/token");

describe("getStringfromObject tests", () => {
  const obj = {
    string: "test",
    array: MODULES,
    number: 123,
  };
  const expected = `string=test&array=${MODULES}&number=123`;

  test("Must to return a string joined by &", () => {
    const func = getStringfromObject(obj);
    expect(func).toEqual(expected);
  });

  const user = {
    clave: null,
    currentToken: "currentToken",
    otherKey: "otherKey",
  };

  const expectedInfo = {
    clave: 123,
    otherKey: "otherKey",
  };

  test("Must to return correct key on dataToTokenizer when original is null", () => {
    const dataToTokenizer = setDataToTokenizer(user, 123);
    expect(dataToTokenizer).toEqual(expectedInfo);
  });

  test("Must to return correct key on dataToTokenizer when is different key", () => {
    user.clave = 100;
    const dataToTokenizer = setDataToTokenizer(user, 123);
    expect(dataToTokenizer).toEqual(expectedInfo);
  });

  test("Must to return correct key on dataToTokenizer when is same key", () => {
    user.clave = 123;
    const dataToTokenizer = setDataToTokenizer(user, 123);
    expect(dataToTokenizer).toEqual(expectedInfo);
  });
});
