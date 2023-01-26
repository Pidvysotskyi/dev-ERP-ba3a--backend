const { Persona } = require("../../models");

const addPersona = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: user } = req.user;

  console.log(req.body, "Отримане тіло в контролері");

  const { firstName, lastName, surName = " " } = req.body;
  console.log(firstName, "імя");
  console.log(lastName, "Прізвище");
  console.log(surName, "По батькові");

  const allPersons = await Persona.getAll();

  const idArray = allPersons.map(item => item.CA_PERSONA_ID);

  const id = Math.max(...idArray) + 1;

  const personaInfo = {
    firstName,
    lastName,
    surName,
    id,
    user,
  };

  console.log(personaInfo, "повне інфо для створення");

  const newPersona = new Persona(personaInfo);

  await newPersona.add();

  const addedPersona = await Persona.getById(newPersona.id);

  res.status(201).json({
    message: "Persona created",
    persona: addedPersona,
  });
};

module.exports = addPersona;
