const parseList = (rawJSON) => {
  try {
    const fixedJsonString = rawJSON.replace(/(?<=\[)|(?=,)|(?<=\,)|(?=\])/g, '"');
    const parsedList = JSON.parse(fixedJsonString);

    return parsedList;
  } catch (error) {
    return [];
  }
};

const arrParseToString = (arr) => {
  const arrToString = arr.toString();
  const stringModules = `[${arrToString}]`;

  return stringModules;
};

const convertObjectKeysIntoArrayKeys = (arr) => {
  try {
    const allKeys = arr.map(key => Number(key?.claveIntermediario?.value));

    return allKeys;
  } catch (error) {
    return [];
  }
};

const cleanKeys = (arr) => {
  try {
    const sortedKeys = arr.sort((a, b) => a - b);
    const filteredKeys = sortedKeys.filter(key => key >= 4e6 && key < 5e6);
    const transformedKeys = filteredKeys.map(key => {
      let keyText = key.toString().split("");
      keyText[0] = "0";
      const keyWord = keyText.join("");
      const transformedKey = keyWord.replace(/^(0+)/g, "");
      const keyNumber = Number(transformedKey);

      return keyNumber;
    });

    return transformedKeys;
  } catch (error) {
    return [];
  }
};

const convertBrokerToBrokerIAXIS = (broker) => {
  var BrokerIAXIS = broker.toString().padStart(6, '0');
  return BrokerIAXIS.toString().padStart(7, '4');
}

module.exports = {
  parseList,
  arrParseToString,
  convertObjectKeysIntoArrayKeys,
  cleanKeys,
  convertBrokerToBrokerIAXIS
};
