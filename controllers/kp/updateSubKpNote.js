const { Kpf, Kpa } = require("../../models");
const { Conflict } = require("http-errors");

const updateSubKpNote = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;

  const { subKpKey, subKpNote } = req.body;

  const kpType = subKpKey.split("-")[4][0];

  if (kpType === "f") {
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
  } else if (kpType === "a") {
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
  } else {
    throw new Conflict(`The key of sub Kp in not right format`);
  }
};

module.exports = updateSubKpNote;
