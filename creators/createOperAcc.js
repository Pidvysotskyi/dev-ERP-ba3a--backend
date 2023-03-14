const { OperationalAcc } = require("../modelsFin");

const createOperAcc = async uahAccInfo => {
  const uahAcc = new OperationalAcc(uahAccInfo);

  await uahAcc.add();
};

module.exports = createOperAcc;
