const { Kp } = require("../../models");
const { NotFound } = require("http-errors");

const deleteKp = async (req, res, next) => {
  const { kpKey } = req.params;

  const project = await Kp.getByKey(kpKey);

  if (!project) {
    throw new NotFound(`Project ${kpKey} does not exist`);
  }

  await Kp.delete(kpKey);
  res.status(200).json({
    message: `KP ${kpKey} deleted`,
  });
};

module.exports = deleteKp;
