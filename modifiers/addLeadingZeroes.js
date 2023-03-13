const addLeadingZeroes = (num, dig) => {
  const numString = num.toString();
  const numZeroesToAdd = dig - numString.length;
  let result = "";

  for (let i = 0; i < numZeroesToAdd; i++) {
    result += "0";
  }

  result += numString;

  return result;
};

module.exports = addLeadingZeroes;
