const { Kp } = require("../../models");

const getKp = async (req, res, next) => {
  const { kpKey } = req.params;
  const kp = await Kp.getByKey(kpKey);
  res.status(200).json(kp);
};

module.exports = getKp;
