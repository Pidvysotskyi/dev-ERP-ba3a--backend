const { CONF_PERSONA } = require("../config");

const confidential = (req, res, next) => {
  console.log(req.body, "отримано тіло на валідацію");

  const { isConfidential } = req.body;

  console.log(isConfidential, "перевірка на конфеденційність");

  if (!isConfidential) {
    console.log("Персона не корнфеденційна, перехід");
    next();
    return;
  }

  console.log(req.body, "Тіло перед присвоєнням конфіденційного імя");

  req.body = { ...CONF_PERSONA };
  console.log(req.body, "Тіло перед передачею на котрролер");
  console.log("Передали на створення конфеденційної персони");
  next();
};

module.exports = confidential;
