const { Project } = require("../../models");

const deleteProject = async (req, res, next) => {
  const { projectKey } = req.params;
  await Project.delete(projectKey);
  res.status(200).json({
    message: `Project ${projectKey} deleted`,
  });
};

module.exports = deleteProject;
