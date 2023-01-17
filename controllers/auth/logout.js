const { User } = require("../../models");

const logout = async (req, res) => {
  const { AUTHORIZATION_ID } = req.user;

  await User.resetToken(AUTHORIZATION_ID);
  res.status(204).json();
};

module.exports = logout;
