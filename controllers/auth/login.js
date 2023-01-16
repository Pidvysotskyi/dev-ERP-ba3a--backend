const { User } = require("../../models");
const { SECRET_KEY } = require("../../config");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  const { login, password } = req.body;
  const [users, _] = await User.getAll();

  const user = users.find(user => user.LOGIN === login);

  if (!user) {
    throw new Unauthorized("wrong login");
  }

  const checkPass = User.comparePassword(password, user.PASSWORD);

  console.log(checkPass);

  if (!checkPass) {
    throw new Unauthorized("wrong password");
  }

  const payload = {
    id: user.AUTHORIZATION_ID,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.setToken(user.AUTHORIZATION_ID, token);

  res.json({
    token,
    user: {
      login: user.LOGIN,
    },
  });
};

module.exports = login;
