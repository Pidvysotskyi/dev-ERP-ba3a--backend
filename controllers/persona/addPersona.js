const { Persona } = require("../../models");

const addPersona = async (req, res, next) => {
  const { DA_LOGIN } = req.user;

  console.log(req.body, "Отримане тіло в контролері");

  const personaInfo = req.body;
  console.log(personaInfo, "Персона інфо");

  const allPersons = await Persona.getAll();

  const idArray = allPersons.map(item => item.CA_PERSONA_ID);

  personaInfo.id = Math.max(...idArray) + 1;
  personaInfo.user = DA_LOGIN;

  console.log("повне інфо для створення");
  console.log(personaInfo);

  const newPersona = new Persona(personaInfo);

  await newPersona.add();

  const addedPersona = await Persona.getById(newPersona.id);

  res.status(201).json({
    message: "Persona created",
    persona: addedPersona,
  });
};

module.exports = addPersona;
