const splitKpxKey = key => {
  const [kpIn, projectIn, orgstructure, personaId, kpa] = key.split("-");
  const client = [orgstructure, personaId].join("-");
  const kpxIn = kpa.slice(1);

  return {
    kpIn,
    projectIn,
    client,
    kpxIn,
  };
};

module.exports = splitKpxKey;
