const { Client, Persona, OrgStructure } = require("../../models");
const { Conflict } = require("http-errors");

const addClient = async (req, res, next) => {
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

  const existingClient = await Client.findbyPersona(personaId);

  if (existingClient) {
    throw new Conflict(`same Persona_ID already exist`);
  }

  const clientInfo = {
    personaId,
    orgStructureId,
    creatorId,
  };

  const newClient = new Client(clientInfo);

  const id = await newClient.add();

  const addedClient = await Client.getById(id);

  res.status(201).json({
    message: "Client Created",
    persona: addedClient,
  });
};

module.exports = addClient;
