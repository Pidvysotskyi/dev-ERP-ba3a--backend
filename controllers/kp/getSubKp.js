const { Kpa, Kpf } = require("../../models");

const getSubKp = async (req, res, next) => {
  const { kpKey } = req.params;
  const kpaList = await Kpa.getForKp(kpKey);
  const kpfList = await Kpf.getForKp(kpKey);
  const subKpList = [...kpaList, ...kpfList];

  res.status(200).json(subKpList);
};

module.exports = getSubKp;
