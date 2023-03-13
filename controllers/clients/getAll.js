const { Client } = require("../../models");
const { OperationalAcc } = require("../../modelsFin");

const getClients = async (req, res, next) => {
  const allClients = await Client.getAll();

  const accParams = {
    clientKey: "NOK-12",
    countryCode: "UA",
    userId: 1,
    balanceCode: "2880",
    cityCode: "02",
    customerCode: "02",
    currencyCode: "980",
    accName: "Дт. заборгованість Клієнта «NOK-12» UAH",
  };
  const newAcc = new OperationalAcc(accParams);

  await newAcc.add();

  res.status(200).json(allClients);
};

module.exports = getClients;
