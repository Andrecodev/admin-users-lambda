const { enCripto, desCripto } = require("../../utils/DesCripto");

describe("Crypto tests", () => {
  const { KEYAPP, KEYDES } = process.env;
  const data = "Liberty2021";
  const encrypted = "OO6/8iB3TfsR84ORd8qW0A==";
  const ciphered = "rqedbZBZx2ehdfQYz8IJnw==";

  test("Must to cypher correctly", () => {
    const func = enCripto(data, KEYAPP);
    expect(func).toEqual(ciphered);
  });

  test("Must to Decypher correctly", () => {
    const func = desCripto(encrypted, KEYDES);
    expect(func).toEqual(data);
  });
});
