const { User } = require("../../models");
const { Unauthorized } = require("http-errors");

const { FIRST_PASSWORD } = require("../../config");

const firstLogin = async (req, res, next) => {
  const { login, password } = req.body;
  const [users, _] = await User.getAll();

  const user = users.find(user => user.A_LOGIN === login);

  if (!user) {
    throw new Unauthorized("wrong login");
  }

  if (user.A_PASSWORD !== FIRST_PASSWORD) {
    req.user = user;
    next();
    return;
  }
  if (user.A_PASSWORD !== password) {
    throw new Unauthorized("wrong password");
  }
  res.json({
    id: user.A_AUTHORIZATION_ID,
    message: "Please change the password",
  });
};

module.exports = firstLogin;
