const splitProjectKey = key => {
  const [projectIn, orgstructure, personaId] = key.split("-");
  const client = [orgstructure, personaId].join("-");

  return {
    projectIn,
    client,
  };
};

module.exports = splitProjectKey;
