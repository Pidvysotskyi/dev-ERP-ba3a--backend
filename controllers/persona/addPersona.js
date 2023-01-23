const { Persona } = require("../../models");

const addPersona = async (req, res, next) => {
  const { DA_LOGIN } = req.user;

  const personaInfo = req.body;

  const allPersons = await Persona.getAll();

  const idArray = allPersons.map(item => item.CA_PERSONA_ID);

  personaInfo.id = Math.max(...idArray) + 1;
  personaInfo.user = DA_LOGIN;

  console.log(personaInfo.user);

  const newPersona = new Persona(personaInfo);

  await newPersona.add();

  const addedPersona = await Persona.getById(newPersona.id);

  res.status(201).json({
    message: "Persona created",
    persona: addedPersona,
  });
};

module.exports = addPersona;
