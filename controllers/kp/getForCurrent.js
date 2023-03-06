const { Kp, TodoKp } = require("../../models");

const getForCurrent = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const kpList = await Kp.getForUser(userId);
  const todoList = await TodoKp.getForUser(userId);
  res.status(200).json({
    kpList,
    todoList,
  });
};

module.exports = getForCurrent;
