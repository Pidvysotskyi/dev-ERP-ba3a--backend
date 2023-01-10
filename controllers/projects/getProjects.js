const { Project } = require("../../models");

const getProjects = async (req, res, next) => {
  const [projects, _] = await Project.getAll();
  res.status(200).json({ projects });
};

module.exports = getProjects;
