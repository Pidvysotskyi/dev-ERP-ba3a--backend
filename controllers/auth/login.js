const { User } = require("../../models");
const { SECRET_KEY } = require("../../config");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  const { password } = req.body;
  const user = req.user;

  if (!user) {
    throw new Unauthorized("wrong login");
  }

  const checkPass = User.comparePassword(password, user.A_PASSWORD);

  if (!checkPass) {
    throw new Unauthorized("wrong password");
  }

  const payload = {
    id: user.A_AUTHORIZATION_ID,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.setToken(user.A_AUTHORIZATION_ID, token);

  res.json({
    token,
    user: {
      login: user.A_LOGIN,
    },
  });
};

module.exports = login;
