const { Kp } = require("../../models");
const { Conflict } = require("http-errors");

const updatePrePayment = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;

  const { kpKey, prepaymentCost, prepaymentDeadline } = req.body;

  const kp = await Kp.getByKey(kpKey);

  if (!kp) {
    throw new Conflict(`Cannot find the Kp ${kpKey}`);
  }

  const kpParams = {
    userId,
    prepaymentDeadline,
    prepaymentCost,
  };

  const newKp = new Kp(kpParams);

  await newKp.changePrepaiment(kpKey);

  const updatedKp = await Kp.getByKey(kpKey);

  res.status(201).json({
    message: `Kp ${kpKey} Updated`,
    kp: updatedKp,
  });
};

module.exports = updatePrePayment;
