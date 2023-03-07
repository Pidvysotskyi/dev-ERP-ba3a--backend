const { Kp, Kpf } = require("../../models");
const { Conflict } = require("http-errors");

const addKpf = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { kpKey, subKpNote } = req.body;

  const kp = await Kp.getByKey(kpKey);

  if (!kp) {
    throw new Conflict(`Cannot find the Kp ${kpKey}`);
  }

  const kpfInfo = {
    kpKey,
    subKpNote,
    userId,
  };

  const newKpf = new Kpf(kpfInfo);

  const key = await newKpf.add();

  const addedKpf = await Kpf.getByKey(key);

  res.status(201).json({
    message: `Kpf ${key} Created`,
    kpa: addedKpf,
  });
};

module.exports = addKpf;
