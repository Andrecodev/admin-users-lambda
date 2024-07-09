const hasSomeTrueValue = (dataToVerify) => {
  const conditionalKeys = Object.keys(dataToVerify);
  const hasConditionalStatus = conditionalKeys.map(key => dataToVerify[key]);
  const hasToEarlyReturn = hasConditionalStatus.some(val => !!val);

  return hasToEarlyReturn;
};

module.exports = {
  hasSomeTrueValue,
};
