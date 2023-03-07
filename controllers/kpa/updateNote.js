const { Kpa } = require("../../models");
const { Conflict } = require("http-errors");

const updateNote = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;

  const { subKpKey, subKpNote } = req.body;

  const kpa = await Kpa.getByKey(subKpKey);

  if (!kpa) {
    throw new Conflict(`Cannot find the Kpa ${subKpKey}`);
  }

  const kpaParams = {
    subKpNote,
    userId,
  };

  const newKpa = new Kpa(kpaParams);

  await newKpa.updateNote(subKpKey);

  const updatedKpa = await Kpa.getByKey(subKpKey);

  res.status(201).json({
    message: `Kpa ${subKpKey} Updated`,
    kp: updatedKpa,
  });
};

module.exports = updateNote;
