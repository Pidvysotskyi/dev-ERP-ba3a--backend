const { DigitalMatch } = require("../modelsRef");

const getNumericCode = async stringCode => {
  const array = stringCode.split("");

  const numberArray = await Promise.all(
    array.map(async item => {
      const result = await DigitalMatch.getNumberBySymbol(item);

      if (!result) {
        return "0";
      }
      return result.number;
    })
  );

  const countryCode = numberArray.join("");

  return countryCode;
};

module.exports = getNumericCode;
