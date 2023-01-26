const { Persona } = require("../../models");

const addPersona = async (req, res, next) => {
  const { DA_LOGIN: user } = req.user;

  const { firstName, lastName, patronym = null } = req.body;

  const personaInfo = {
    firstName,
    lastName,
    patronym,
    user,
  };

  const persona = new Persona(personaInfo);

  const id = await persona.add();

  console.log(id);

  const result = await Persona.getById(id);

  console.log(result);

  res.status(201).json({
    message: "Persona created",
    persona: result,
  });
};

module.exports = addPersona;
