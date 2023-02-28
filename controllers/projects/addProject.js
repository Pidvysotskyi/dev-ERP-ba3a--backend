const { Project, Client, OrgStructure } = require("../../models");
const { Conflict } = require("http-errors");

const addProject = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { clientId, orgStructureId, designerId, designNumber, projectAdress, finalDate } = req.body;

  const client = await Client.getById(clientId);

  if (!client) {
    throw new Conflict(`Cannot find the Client ${clientId}`);
  }

  const orgStructure = await OrgStructure.getById(orgStructureId);

  if (!orgStructure) {
    throw new Conflict(`Cannot find the Organisation with id:${orgStructureId}`);
  }

  const projectInfo = {
    clientId,
    orgStructureId,
    userId,
    designerId,
    designNumber,
    projectAdress,
    finalDate,
    status: "Активний",
  };

  console.log(designerId);

  const newProject = new Project(projectInfo);

  const key = await newProject.add();

  const addedProject = await Project.getByKey(key);

  res.status(201).json({
    message: `Project ${key} Created`,
    project: addedProject,
  });
};

module.exports = addProject;
