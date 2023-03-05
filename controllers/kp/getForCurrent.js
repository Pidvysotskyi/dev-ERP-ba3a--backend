const { Kp } = require("../../models");

const getForCurrent = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const kps = await Kp.getForUser(userId);
  res.status(200).json(kps);
};

module.exports = getForCurrent;
