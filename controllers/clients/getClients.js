const { Client } = require("../../models");

const getClients = async (req, res, next) => {
  const [clients, _] = await Client.getAll();
  res.status(200).json({ clients });
};

module.exports = getClients;
