const getCurrentUser = async (req, res, next) => {
  const user = req.user;
  res.json(user);
};

module.exports = getCurrentUser;
