const { Project, Kp, OrgStructure } = require("../../models");
const { Conflict } = require("http-errors");

const uppdateKp = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { projectKey, managerKpId, orgStructureId, designerId, designerBonus, startDate, finalDate, kpNote } = req.body;

  const project = await Project.getByKey(projectKey);

  if (!project) {
    throw new Conflict(`Cannot find the Project ${projectKey}`);
  }

  const orgStructure = await OrgStructure.getById(orgStructureId);

  if (!orgStructure) {
    throw new Conflict(`Cannot find the Organisation with id:${orgStructureId}`);
  }

  const projectInfo = {
    projectKey,
    managerKpId,
    orgStructureId,
    designerId,
    designerBonus,
    startDate,
    finalDate,
    kpNote,
    userId,
  };

  const newKp = new Kp(projectInfo);

  const key = await newKp.add();

  const addedKP = await Kp.getByKey(key);

  res.status(201).json({
    message: `Kp ${key} Created`,
    kp: addedKP,
  });
};

module.exports = uppdateKp;
