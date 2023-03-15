const { Kp, Kpa, Kpf } = require("../../models");

const getKp = async (req, res, next) => {
  const { kpKey } = req.params;
  const kp = await Kp.getByKey(kpKey);

  const kpaList = await Kpa.getForKp(kpKey);
  const kpfList = await Kpf.getForKp(kpKey);
  const subKpList = [...kpaList, ...kpfList];

  res.status(200).json({ kp, subKpList });
};

module.exports = getKp;
