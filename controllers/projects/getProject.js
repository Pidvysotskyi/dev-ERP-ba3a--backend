const { Project, Contract, Kp, Annex, Einfo } = require("../../models");

const getProject = async (req, res, next) => {
  const { projectKey } = req.params;
  const project = await Project.getByKey(projectKey);

  const contracts = await Contract.getForProject(projectKey);

  const kps = await Kp.getForProject(projectKey);

  const annexes = await Annex.getForProject(projectKey);

  const einfo = await Einfo.getForProject(projectKey);

  res.status(200).json({ project, contracts, kps, annexes, einfo });
};

module.exports = getProject;
