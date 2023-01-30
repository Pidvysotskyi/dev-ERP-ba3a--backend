const { Project } = require("../../models");

const getforClient = async (req, res, next) => {
  const { clientId } = req.params;
  const projects = await Project.getForClient(clientId);
  res.status(200).json(projects);
};

module.exports = getforClient;
