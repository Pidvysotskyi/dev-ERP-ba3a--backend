const { Kp } = require("../../models");

const getForProject = async (req, res, next) => {
  const { projectKey } = req.params;
  const kps = await Kp.getForProject(projectKey);
  res.status(200).json(kps);
};

module.exports = getForProject;
