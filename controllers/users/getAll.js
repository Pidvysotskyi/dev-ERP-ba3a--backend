const { User } = require("../../models");

const getUsers = async (req, res, next) => {
  const allUsers = await User.getAll();
  res.status(200).json(allUsers);
};

module.exports = getUsers;
