const { hasSomeTrueValue } = require("../../utils/earlyReturn");

describe("Early return tests", () => {
  test("Must to return early because has three conditions", () => {
    const dataToVerify = {
      notValidated: true,
      forzarModPassword: true,
      isGestor: true,
    };
    const response = hasSomeTrueValue(dataToVerify);
    expect(response).toBe(true);
  });

  test("Must to return early because has two conditions (notValidated and pwd)", () => {
    const dataToVerify = {
      notValidated: true,
      forzarModPassword: true,
      isGestor: false,
    };
    const response = hasSomeTrueValue(dataToVerify);
    expect(response).toBe(true);
  });

  test("Must to return early because has two conditions (notValidated and gestor)", () => {
    const dataToVerify = {
      notValidated: true,
      forzarModPassword: false,
      isGestor: true,
    };
    const response = hasSomeTrueValue(dataToVerify);
    expect(response).toBe(true);
  });

  test("Must to return early because has two conditions (pwd and gestor)", () => {
    const dataToVerify = {
      notValidated: false,
      forzarModPassword: true,
      isGestor: true,
    };
    const response = hasSomeTrueValue(dataToVerify);
    expect(response).toBe(true);
  });

  test("Must to return early because has one condition (notValidated)", () => {
    const dataToVerify = {
      notValidated: true,
      forzarModPassword: false,
      isGestor: false,
    };
    const response = hasSomeTrueValue(dataToVerify);
    expect(response).toBe(true);
  });  

  test("Must to return early because has one conditions (pwd)", () => {
    const dataToVerify = {
      notValidated: false,
      forzarModPassword: true,
      isGestor: false,
    };
    const response = hasSomeTrueValue(dataToVerify);
    expect(response).toBe(true);
  });

  test("Must to return early because has one condition (gestor)", () => {
    const dataToVerify = {
      notValidated: false,
      forzarModPassword: false,
      isGestor: true,
    };
    const response = hasSomeTrueValue(dataToVerify);
    expect(response).toBe(true);
  });

  test("Must to return false because has no conditions", () => {
    const dataToVerify = {
      notValidated: false,
      forzarModPassword: false,
      isGestor: false,
    };
    const response = hasSomeTrueValue(dataToVerify);
    expect(response).toBe(false);
  });
});
