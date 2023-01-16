const { User } = require("../../models");
const { Unauthorized } = require("http-errors");

const changePass = async (req, res, next) => {
  const { password1, password2, id } = req.body;

  if (password1 !== password2) {
    throw new Unauthorized("entered passwords are not equal");
  }

  await User.setPassword(id, password1);

  const [users, _] = await User.getAll();

  const user = users.find(user => user.AUTHORIZATION_ID === id);

  req.body = {
    login: user.LOGIN,
    password: password1,
  };
  next();
};

module.exports = changePass;
