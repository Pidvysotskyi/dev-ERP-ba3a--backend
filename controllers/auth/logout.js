const { User } = require("../../models");

const logout = async (req, res) => {
  const { DA_EMPLOYEE_ID } = req.user;

  await User.resetToken(DA_EMPLOYEE_ID);
  res.status(204).json();
};

module.exports = logout;
