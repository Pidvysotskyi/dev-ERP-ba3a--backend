const app = require("./app");

const { SERVER_PORT } = require("./config");

app.listen(SERVER_PORT, () => {
  console.log(`Server is running in port ${SERVER_PORT}`);
});
