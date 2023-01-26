const { OrgStructure } = require("../../models");

const getAll = async (req, res, next) => {
  const allStructure = await OrgStructure.getAll();

  res.json(allStructure);
};

module.exports = getAll;
