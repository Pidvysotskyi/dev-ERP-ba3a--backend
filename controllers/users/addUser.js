const { User, Persona, OrgStructure } = require("../../models");
const { Conflict } = require("http-errors");

const register = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: creatorId } = req.user;
  const { personaId, orgStructureId } = req.body;

  const person = await Persona.getById(personaId);

  if (!person) {
    throw new Conflict(`Cannot find the Person with id:${personaId}`);
  }

  const orgStructure = await OrgStructure.getById(orgStructureId);

  if (!orgStructure) {
    throw new Conflict(`Cannot find the Organisation with id:${orgStructureId}`);
  }

  const existingUser = await User.findbyPersona(personaId);

  if (existingUser) {
    throw new Conflict(`same Persona_ID already exist`);
  }

  const login = [person.CA_LAST_NAME_ENG, person.CA_PERSONA_ID].join("-");

  const userInfo = {
    personaId,
    fullName: person.CA_FULL_NAME,
    login,
    orgStructureId,
    creatorId,
  };

  const newUser = new User(userInfo);

  const id = await newUser.add();

  const addedUser = await User.getById(id);

  res.status(201).json({
    message: "User Created",
    persona: addedUser,
  });
};

module.exports = register;
