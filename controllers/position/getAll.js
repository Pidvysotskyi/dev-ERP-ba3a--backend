const { Position } = require("../../models");

const getAll = async (req, res, next) => {
  const allPositions = await Position.getAll();

  res.json(allPositions);
};

module.exports = getAll;
