const { Client } = require("../../models");

const getClients = async (req, res, next) => {
  const allClients = await Client.getAll();
  res.status(200).json(allClients);
};

module.exports = getClients;
