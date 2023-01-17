const { User } = require("../../models");

const logout = async (req, res) => {
  const { A_AUTHORIZATION_ID } = req.user;

  await User.resetToken(A_AUTHORIZATION_ID);
  res.status(204).json();
};

module.exports = logout;
