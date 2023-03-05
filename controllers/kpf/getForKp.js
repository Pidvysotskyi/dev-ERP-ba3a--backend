const { Kpf } = require("../../models");

const getForKp = async (req, res, next) => {
  const { kpKey } = req.params;
  const kpfList = await Kpf.getForKp(kpKey);
  res.status(200).json(kpfList);
};

module.exports = getForKp;
