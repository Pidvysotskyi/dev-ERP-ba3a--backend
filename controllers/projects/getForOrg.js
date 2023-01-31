const { Project } = require("../../models");

const getforOrg = async (req, res, next) => {
  const { orgStructureId } = req.params;
  const projects = await Project.getForOrg(orgStructureId);
  res.status(200).json(projects);
};

module.exports = getforOrg;
