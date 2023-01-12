const app = require("./app");
// const https = require("https");
// const fs = require("fs");
// const path = require("path");

// const options = {
//   key: fs.readFileSync(path.join(__dirname, "ssl", "ca.key")),
//   cert: fs.readFileSync(path.join(__dirname, "ssl", "ca.crt")),
// };

// const { DB_PORT } = process.env;

app.listen(10002, () => {
  console.log("Server is running in port 10002");
});

// https.createServer(options, app).listen(3001, () => {
//   console.log("server is runing");
// });
