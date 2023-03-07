const { Kp, Kpa } = require("../../models");
const { Conflict } = require("http-errors");

const addKpa = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { kpKey, subKpNote } = req.body;

  const kp = await Kp.getByKey(kpKey);

  if (!kp) {
    throw new Conflict(`Cannot find the Kp ${kpKey}`);
  }

  const kpaInfo = {
    kpKey,
    subKpNote,
    userId,
  };

  const newKpa = new Kpa(kpaInfo);

  const key = await newKpa.add();

  console.log(key, "return after kpa add");

  const addedKpa = await Kpa.getByKey(key);

  res.status(201).json({
    message: `Kpa ${key} Created`,
    kpa: addedKpa,
  });
};

module.exports = addKpa;
