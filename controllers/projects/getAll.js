const { Project } = require("../../models");

const getAll = async (req, res, next) => {
  const projects = await Project.getAll();
  res.status(200).json(projects);
};

module.exports = getAll;
