const { Client, Persona, OrgStructure } = require("../../models");
const { Conflict } = require("http-errors");
const { createOperAcc } = require("../../creators");
const { OperationalAcc } = require("../../modelsFin");

const addClient = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { personaId, orgStructureId } = req.body;

  const person = await Persona.getById(personaId);

  if (!person) {
    throw new Conflict(`Cannot find the Person with id:${personaId}`);
  }

  const orgStructure = await OrgStructure.getShortNameById(orgStructureId);

  if (!orgStructure) {
    throw new Conflict(`Cannot find the Organisation with id:${orgStructureId}`);
  }

  const existingClient = await Client.findbyPersona(personaId);

  if (existingClient) {
    throw new Conflict(`same Persona_ID already exist`);
  }

  const clientInfo = {
    personaId,
    orgStructure,
    userId,
  };

  const newClient = new Client(clientInfo);

  const id = await newClient.add();

  const addedClient = await Client.getById(id);

  // finantional operations block

  const { EA_CITY_CODE: cityCode } = await OrgStructure.getById(orgStructureId);

  const clientKey = addedClient.DC_CLIENT_IN;

  const commonOptions = { personaId, orgStructureId, userId, countryCode: "UA", cityCode, customerCode: "02" };

  const balanceOptions = {
    entityFound: {
      balanceCode: "2600",
      accName: `Кошти суб’єкта господарської діяльності ${clientKey}`,
    },
    сustomerReceivables: {
      balanceCode: "2880",
      accName: `Дебіторська заборгованість Клієнта ${clientKey}`,
    },
  };

  const currencyOptions = {
    uah: {
      currencyCode: "980",
    },
    usd: {
      currencyCode: "840",
    },
    eur: {
      currencyCode: "978",
    },
  };

  await createOperAcc({ ...commonOptions, ...balanceOptions.entityFound, ...currencyOptions.uah, clientKey });
  await createOperAcc({ ...commonOptions, ...balanceOptions.entityFound, ...currencyOptions.usd, clientKey });
  await createOperAcc({ ...commonOptions, ...balanceOptions.entityFound, ...currencyOptions.eur, clientKey });
  await createOperAcc({ ...commonOptions, ...balanceOptions.сustomerReceivables, ...currencyOptions.uah, clientKey });
  await createOperAcc({ ...commonOptions, ...balanceOptions.сustomerReceivables, ...currencyOptions.usd, clientKey });
  await createOperAcc({ ...commonOptions, ...balanceOptions.сustomerReceivables, ...currencyOptions.eur, clientKey });

  const createdAccounts = await OperationalAcc.getForClient(clientKey);

  res.status(201).json({
    message: "Client Created",
    client: addedClient,
    createdAccounts,
  });
};

module.exports = addClient;
