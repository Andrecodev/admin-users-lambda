const { parseList, convertObjectKeysIntoArrayKeys, cleanKeys, arrParseToString } = require("../../utils/parsers");

describe("parsers tests", () => {
  test("parseList must to return an array", () => {
    const dataToParse = "[1,2,String,4]";
    const dataParsed = ["1", "2", "String", "4"];
    const func = parseList(dataToParse);
    expect(func).toEqual(dataParsed);
  });

  test("parseList must to return empty array on wrong entry", () => {
    const dataToParse = "Testing parseList";
    const func = parseList(dataToParse);
    expect(func).toEqual([]);
  });

  test("arrParseToString must to return an string with array syntax", () => {
    const dataToParse = ["Label 1", "Label 2", "Label 3"];
    const dataParsed = "[Label 1,Label 2,Label 3]";
    const func = arrParseToString(dataToParse);
    expect(func).toEqual(dataParsed);
  });

  test("convertObjectKeysIntoArrayKeys must to return an array of numbers", () => {
    const arr = [
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
    ];
    const expected = [-1, 2];
    const func = convertObjectKeysIntoArrayKeys(arr);
    expect(func).toEqual(expected);
  });

  test("convertObjectKeysIntoArrayKeys must to return an empty array on wrong entry", () => {
    const func = convertObjectKeysIntoArrayKeys("[]");
    expect(func).toEqual([]);
  });

  test("cleanKeys must to return an array of numbers", () => {
    const arr = [-999, 120, 3999999, 4000001, 4123456, 4999999, 5000001];
    const expected = [1, 123456, 999999];
    const func = cleanKeys(arr);
    expect(func).toEqual(expected);
  });

  test("cleanKeys must to return an empty array", () => {
    const func = cleanKeys([]);
    expect(func).toEqual([]);
  });
});
