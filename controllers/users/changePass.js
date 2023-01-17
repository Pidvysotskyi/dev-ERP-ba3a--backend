const { User } = require("../../models");

const changePass = async (req, res, next) => {
  const { password, id } = req.body;

  await User.setPassword(id, password);

  const [[user], _] = await User.getById(id);

  req.body = {
    login: user.LOGIN,
    password,
  };
  next();
};

module.exports = changePass;
