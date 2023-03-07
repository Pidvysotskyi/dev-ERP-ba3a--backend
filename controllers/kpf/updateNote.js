const { Kpf } = require("../../models");
const { Conflict } = require("http-errors");

const updateNote = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;

  const { subKpKey, subKpNote } = req.body;

  const kpf = await Kpf.getByKey(subKpKey);

  if (!kpf) {
    throw new Conflict(`Cannot find the Kpa ${subKpKey}`);
  }

  const kpfParams = {
    subKpNote,
    userId,
  };

  const newKpf = new Kpf(kpfParams);

  await newKpf.updateNote(subKpKey);

  const updatedKpf = await Kpf.getByKey(subKpKey);

  res.status(201).json({
    message: `Kpf ${subKpKey} Updated`,
    kp: updatedKpf,
  });
};

module.exports = updateNote;
