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

  const checkPass = User.comparePassword(password, user.DA_PASSWORD);

  if (!checkPass) {
    throw new Unauthorized("wrong password");
  }

  const payload = {
    id: user.DA_EMPLOYEE_ID,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "5h" });
  await User.setToken(user.DA_EMPLOYEE_ID, token);

  res.json({
    token,
    user: {
      login: user.DA_LOGIN,
    },
  });
};

module.exports = login;
