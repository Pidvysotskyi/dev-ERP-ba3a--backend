const { Kpa } = require("../../models");
const { Conflict } = require("http-errors");

const updateNote = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;

  const { kpaKey, kpaNote } = req.body;

  const kpa = await Kpa.getByKey(kpaKey);

  if (!kpa) {
    throw new Conflict(`Cannot find the Kpa ${kpaKey}`);
  }

  const kpaParams = {
    kpaNote,
    userId,
  };

  const newKpa = new Kpa(kpaParams);

  await newKpa.updateNote(kpaKey);

  const updatedKpa = await Kpa.getByKey(kpaKey);

  res.status(201).json({
    message: `Kpa ${kpaKey} Updated`,
    kp: updatedKpa,
  });
};

module.exports = updateNote;
