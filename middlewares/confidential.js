const { CONF_PERSONA } = require("../config");

const confidential = (req, res, next) => {
  const { isConfidential } = req.body;

  console.log(isConfidential, "перевірка на конфеденційність");

  if (!isConfidential) {
    console.log("Персона не корнфеденційна, перехід");
    next();
    return;
  }

  req.body = CONF_PERSONA;
  console.log(req.body);
  console.log("Передали на створення конфеденційної персони");
  next();
};

module.exports = confidential;
