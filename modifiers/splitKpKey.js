const splitKpKey = key => {
  const [kpIn, projectIn, orgstructure, personaId] = key.split("-");
  const client = [orgstructure, personaId].join("-");

  return {
    kpIn,
    projectIn,
    client,
  };
};

module.exports = splitKpKey;
