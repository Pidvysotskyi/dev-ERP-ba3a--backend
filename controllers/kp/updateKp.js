const { Kp } = require("../../models");
const { Conflict } = require("http-errors");

const uppdateKp = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { kpKey, managerKpId, orgStructureId, designerId, designerBonus, startDate, finalDate, kpNote } = req.body;

  const kp = await Kp.getByKey(kpKey);

  if (!kp) {
    throw new Conflict(`Cannot find the Kp ${kpKey}`);
  }

  const kpParams = {
    managerKpId,
    orgStructureId,
    designerId,
    designerBonus,
    startDate,
    finalDate,
    kpNote,
    userId,
  };

  const newKp = new Kp(kpParams);

  await newKp.update(kpKey);

  const updatedKp = await Kp.getByKey(kpKey);

  res.status(201).json({
    message: `Kp ${kpKey} Updated`,
    kp: updatedKp,
  });
};

module.exports = uppdateKp;
