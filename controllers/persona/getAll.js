const { Persona } = require("../../models");

const getAll = async (req, res, next) => {
  const allPersons = await Persona.getAll();

  res.json(allPersons);
};

module.exports = getAll;
