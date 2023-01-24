const { User, Persona } = require("../../models");
const { Conflict } = require("http-errors");
const { transliteration } = require("../../modifiers");

const register = async (req, res, next) => {
  const { personaId } = req.body;

  const users = await User.getAll();

  const user = users.find(item => item.CA_PERSONA_ID === personaId);

  if (user) {
    throw new Conflict(`same Persona_ID already exist`);
  }

  const idArray = users.map(item => item.DA_EMPLOYEE_ID);

  const id = Math.max(...idArray) + 1;

  const allPersons = await Persona.getAll();

  const person = allPersons.find(item => item.CA_PERSONA_ID === personaId);

  if (!person) {
    throw new Conflict(`Cannot find the Person with id:${personaId}`);
  }

  const login = [transliteration(person.CA_SECOND_NAME), person.CA_PERSONA_ID].join("-");

  const userInfo = {
    id,
    personaId,
    fullName: person.CA_FULL_NAME,
    login,
  };

  const newUser = new User(userInfo);

  await newUser.add();

  const addedUser = await User.getById(id);

  res.status(201).json({
    message: "User Created",
    persona: addedUser,
  });
};

module.exports = register;
