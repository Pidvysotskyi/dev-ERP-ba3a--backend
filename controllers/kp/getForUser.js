const { Kp } = require("../../models");

const getforUser = async (req, res, next) => {
  const { userId } = req.params;
  const kps = await Kp.getForUser(userId);
  res.status(200).json(kps);
};

module.exports = getforUser;
