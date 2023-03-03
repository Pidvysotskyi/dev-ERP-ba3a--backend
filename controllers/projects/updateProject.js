const { Project } = require("../../models");
const { Conflict } = require("http-errors");

const updateProject = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { projectKey, designerId, designNumber, projectAdress } = req.body;

  const checkProject = await Project.getByKey(projectKey);

  if (!checkProject) {
    throw new Conflict(`Cannot find the Project ${projectKey}`);
  }

  const project = new Project({ userId, projectKey, designerId, designNumber, projectAdress });

  await project.update(projectKey);

  const updatedProject = await Project.getByKey(projectKey);

  res.status(201).json({
    message: `Project ${projectKey} updated`,
    project: updatedProject,
  });
};

module.exports = updateProject;
