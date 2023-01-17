const { User } = require("../../models");
const { Conflict } = require("http-errors");

const register = async (req, res, next) => {
  const { login } = req.body;

  const [users, _] = await User.getAll();

  const user = users.find(item => item.A_LOGIN === login);

  if (user) {
    throw new Conflict(`login: ${login} in use`);
  }

  const newUser = new User(login);

  await newUser.add();

  res.status(201).json({
    message: `User ${login} already created`,
  });
};

module.exports = register;
