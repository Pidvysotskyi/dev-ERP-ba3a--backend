const { Kp } = require("../../models");
const { Conflict } = require("http-errors");

const updateNote = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;

  const { kpKey, kpNote } = req.body;

  const kp = await Kp.getByKey(kpKey);

  if (!kp) {
    throw new Conflict(`Cannot find the Kp ${kpKey}`);
  }

  const kpParams = {
    kpNote,
    userId,
  };

  const newKp = new Kp(kpParams);

  await newKp.updateNote(kpKey);

  console.log("KP updated");

  const updatedKp = await Kp.getByKey(kpKey);

  res.status(201).json({
    message: `Kp ${kpKey} Updated`,
    kp: updatedKp,
  });
};

module.exports = updateNote;
