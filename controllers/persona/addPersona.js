const { Persona } = require("../../models");

const addPersona = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: creatorId } = req.user;

  const { firstName, lastName, patronym } = req.body;

  const personaInfo = {
    firstName,
    lastName,
    patronym,
    creatorId,
  };

  const persona = new Persona(personaInfo);

  const id = await persona.add();

  const result = await Persona.getById(id);

  res.status(201).json({
    message: "Persona created",
    persona: result,
  });
};

module.exports = addPersona;
