const dayjs = require("dayjs");
const { getBroker } = require("../controllers/invokeLambdas");

const getBrokerChildrenInfo = async ({ childrenKeys, brokerKey, businessName }) => {
  let childrenInfo = [];
  const hasUniqueChild = childrenKeys.length === 1;
  const childIsSameParent = hasUniqueChild && childrenKeys[0] === brokerKey;
  if (childrenKeys.find(x => x === brokerKey) !== undefined) {
    childrenInfo.push({ brokerKey, businessName: businessName.trim() });
  }
  let failedKeys = [];
  let blockedKeys = [];
  let childrenPromises;
  if (!childIsSameParent) {
    const childrenKeysFiltered = childrenKeys.filter(filterKey => filterKey !== brokerKey);
    childrenPromises = childrenKeysFiltered.map(async key => {
      try {
        const { brokerKey, businessName, leavingDate, officeCode } = await getBroker(key);
        const leavingDateTransformed = dayjs(leavingDate).format("YYYY-MM-DD");
        const officeCodeTransformed = String(officeCode).trim();
        const validDates = ["1900-01-01"];
        const invalidOfficeCodes = ["219"];
        const hasCorrectDate = validDates.includes(leavingDateTransformed);
        const hasToHideKeyByOffice = invalidOfficeCodes.includes(officeCodeTransformed);
        const hasToHideKey = !hasCorrectDate || hasToHideKeyByOffice;
        if (!hasToHideKey) {
          childrenInfo = [...childrenInfo, { brokerKey, businessName }];
        }
        blockedKeys = [...blockedKeys, key];
      } catch (err) {
        failedKeys = [...failedKeys, key];
      }
    });
    await Promise.allSettled(childrenPromises);

    const blockedKeysLength = blockedKeys.length;
    if (blockedKeysLength) console.log(`Blocked keys: ${JSON.stringify({ blockedKeys, totalBlocked: blockedKeysLength })}`);

    const failedKeysLength = failedKeys.length;
    if (failedKeysLength) console.log(`Error getting info keys on login: ${JSON.stringify({ failedKeys, totalFailed: failedKeysLength })}`);
  };

  return childrenInfo;
};

const getChildrenKeys = async ({ childrenKeys }) => {
  let children = [];
  let failedKeys = [];
  let childrenPromises = childrenKeys.map(async key => {
    try {
      const { brokerKey, legalRepresentative, socialReason, parentKey, officeCode, officeName = "" } = await getBroker(key);
      let brokerInformation = {
        brokerKey,
        legalRepresentative: legalRepresentative.trim(),
        socialReason: socialReason.trim(),
        officeCode,
        office: officeName.trim(),
      };

      if (key === parentKey) brokerInformation.isParentKey = true;

      children = [...children, { ...brokerInformation }];
    } catch (err) {
      failedKeys = [...failedKeys, key];
    }
  });
  await Promise.allSettled(childrenPromises);

  const failedKeysLength = failedKeys.length;
  if (failedKeysLength) console.log(`Error getting info keys on commercialNetwork: ${JSON.stringify({ failedKeys, totalFailed: failedKeysLength })}`);

  return children;
};

module.exports = {
  getBrokerChildrenInfo,
  getChildrenKeys,
};
