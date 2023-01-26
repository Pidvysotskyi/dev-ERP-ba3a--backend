const { CONF_PERSONA } = require("../config");

const confidential = (req, res, next) => {
  const { isConfidential } = req.body;

  if (!isConfidential) {
    next();
    return;
  }

  req.body = { ...CONF_PERSONA };
  next();
};

module.exports = confidential;
