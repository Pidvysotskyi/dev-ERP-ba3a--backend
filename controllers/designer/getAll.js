const { Designer } = require("../../models");

const getAll = async (req, res, next) => {
  const allDesigners = await Designer.getAll();

  res.json(allDesigners);
};

module.exports = getAll;
