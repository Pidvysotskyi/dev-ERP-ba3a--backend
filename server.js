const app = require("./app");

const { DB_PORT } = process.env;

app.listen(DB_PORT, () => {
  console.log("Server is running");
});
