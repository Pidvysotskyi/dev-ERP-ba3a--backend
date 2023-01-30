const { Project } = require("../../models");

const getProject = async (req, res, next) => {
  const { projectKey } = req.params;
  const project = await Project.getByKey(projectKey);
  res.status(200).json(project);
};

module.exports = getProject;
