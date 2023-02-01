const { Project } = require("../../models");

const getforCurrent = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const projects = await Project.getForUser(userId);
  res.status(200).json(projects);
};

module.exports = getforCurrent;
