const app = require("./app");
const https = require("https");

// const { DB_PORT } = process.env;

// app.listen(3001, () => {
//   console.log("Server is running");
// });

https.createServer(app).listen(3001, () => {
  console.log("server is runing");
});
