const app = require("./app");
// const EventEmitter = require("events");
// const emiter = new EventEmitter();

// console.log(emiter.listeners());

const { SERVER_PORT } = require("./config");

app.listen(SERVER_PORT, () => {
  console.log(`Server is running in port ${SERVER_PORT}`);
});
