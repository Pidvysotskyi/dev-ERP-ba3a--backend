const { Persona } = require("../../models");
const { Conflict } = require("http-errors");

const addPersona = async (req, res, next) => {
  const personaInfo = req.body;

  const fullname = [personaInfo.firstName, personaInfo.surName, personaInfo.lastName].join(" ");

  const allPersons = await Persona.getAll();

  const ifExist = allPersons.find(item => item.CA_FULL_NAME === fullname);

  if (ifExist) {
    throw new Conflict("Person already exist");
  }

  const idArray = allPersons.map(item => item.CA_PERSONA_ID);

  personaInfo.id = Math.max(...idArray) + 1;

  const newPersona = new Persona(personaInfo);

  await newPersona.add();

  const addedPersona = await Persona.getById(newPersona.id);

  res.status(201).json({
    message: "Persona created",
    persona: addedPersona,
  });
};

module.exports = addPersona;
