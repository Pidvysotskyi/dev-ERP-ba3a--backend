const { Project } = require("../../models");
const { NotFound } = require("http-errors");

const deleteProject = async (req, res, next) => {
  const { projectKey } = req.params;

  const project = await Project.getByKey(projectKey);

  if (!project) {
    throw new NotFound(`Project ${projectKey} does not exist`);
  }

  await Project.delete(projectKey);
  res.status(200).json({
    message: `Project ${projectKey} deleted`,
  });
};

module.exports = deleteProject;
