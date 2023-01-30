const { Project } = require("../../models");

const getforUser = async (req, res, next) => {
  const { userId } = req.params;
  const projects = await Project.getForUser(userId);
  res.status(200).json(projects);
};

module.exports = getforUser;
