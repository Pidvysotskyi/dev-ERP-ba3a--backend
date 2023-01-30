const app = require("./app");

const { SERVER_PORT } = require("./config");

app.listen(SERVER_PORT, () => {
  console.log(`Server is running in port ${SERVER_PORT}`);
});

const id = "1-NOK-2";

const [projectIn, orgstructure, personaId] = id.split("-");
const client = [orgstructure, personaId].join("-");
console.log(projectIn);
console.log(client);
