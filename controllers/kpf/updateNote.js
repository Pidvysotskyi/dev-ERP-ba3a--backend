const { Kpf } = require("../../models");
const { Conflict } = require("http-errors");

const updateNote = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;

  const { kpfKey, kpfNote } = req.body;

  const kpf = await Kpf.getByKey(kpfKey);

  if (!kpf) {
    throw new Conflict(`Cannot find the Kpa ${kpfKey}`);
  }

  const kpfParams = {
    kpfNote,
    userId,
  };

  const newKpf = new Kpf(kpfParams);

  await newKpf.updateNote(kpfKey);

  const updatedKpf = await Kpf.getByKey(kpfKey);

  res.status(201).json({
    message: `Kpf ${kpfKey} Updated`,
    kp: updatedKpf,
  });
};

module.exports = updateNote;
