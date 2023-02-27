const { Project } = require("../../models");
const { Conflict } = require("http-errors");

const changeStatus = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { status, projectKey } = req.body;

  const checkProject = await Project.getByKey(projectKey);

  if (!checkProject) {
    throw new Conflict(`Cannot find the Client ${projectKey}`);
  }

  const updatedProject = new Project({ userId, status });

  await updatedProject.changeStatus(projectKey);

  const project = await Project.getByKey(projectKey);

  res.status(201).json({
    message: `The status for project ${projectKey} updated`,
    project: project,
  });
};

module.exports = changeStatus;
