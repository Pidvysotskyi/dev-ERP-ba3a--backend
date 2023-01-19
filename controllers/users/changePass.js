const { User } = require("../../models");

const changePass = async (req, res, next) => {
  const { password, id } = req.body;

  await User.setPassword(id, password);

  const user = await User.getById(id);

  req.user = user;

  next();
};

module.exports = changePass;
