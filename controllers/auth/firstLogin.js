const { User } = require("../../models");
const { Unauthorized } = require("http-errors");

const { FIRST_PASSWORD } = require("../../config");

const firstLogin = async (req, res, next) => {
  const { login, password } = req.body;
  const users = await User.getAll();

  const user = users.find(user => user.DA_LOGIN === login);

  if (!user) {
    throw new Unauthorized("wrong login");
  }

  if (user.DA_PASSWORD !== FIRST_PASSWORD) {
    req.user = user;
    next();
    return;
  }
  if (user.DA_PASSWORD !== password) {
    throw new Unauthorized("wrong password");
  }
  res.json({
    id: user.DA_EMPLOYEE_ID,
    message: "Please change the password",
  });
};

module.exports = firstLogin;
