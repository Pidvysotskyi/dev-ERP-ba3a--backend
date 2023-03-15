const { Kp, Kpa, Kpf } = require("../../models");

const getKp = async (req, res, next) => {
  const { kpKey } = req.params;
  const { window } = req.query;

  const kp = await Kp.getByKey(kpKey);
  const kpaList = await Kpa.getForKp(kpKey);
  const kpfList = await Kpf.getForKp(kpKey);
  const subKpList = [...kpaList, ...kpfList];

  if (window === "kp") {
    res.status(200).json({ kp, subKpList });
  } else {
    res.status(200).json(kp);
  }
};

module.exports = getKp;
