const { User } = require("../../models");
const { Unauthorized } = require("http-errors");

const firstPassword = "12345678";

const firstLogin = async (req, res, next) => {
  const { login, password } = req.body;
  const [users, _] = await User.getAll();

  const user = users.find(user => user.LOGIN === login);

  if (!user) {
    throw new Unauthorized("wrong login");
  }

  if (user.PASSWORD !== firstPassword) {
    next();
    return;
  }
  if (user.PASSWORD !== password) {
    throw new Unauthorized("wrong password");
  }
  res.json({
    id: user.AUTHORIZATION_ID,
    message: "Please change the password",
  });
};

module.exports = firstLogin;
