const getCheckSum = n => {
  console.log((n / 97).toString());

  console.log(Math.trunc(n / 97).toString());

  const result = 98 - (n - 97 * Math.trunc(n / 97));

  if (result < 10) {
    return "0" + result.toString();
  }
  return result.toString();
};

module.exports = getCheckSum;
