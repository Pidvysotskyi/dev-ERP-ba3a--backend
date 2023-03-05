const { Kpa } = require("../../models");

const getForKp = async (req, res, next) => {
  const { kpKey } = req.params;
  const kpaList = await Kpa.getForKp(kpKey);
  res.status(200).json(kpaList);
};

module.exports = getForKp;
