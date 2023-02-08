const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const { authRouter, usersRouter, personaRouter, clientsRouter, orgStructureRouter, projectsRouter, designerRouter, positionRouter, kpRouter } = require("./routes/api/");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/persona", personaRouter);
app.use("/clients/", clientsRouter);
app.use("/orgStructure/", orgStructureRouter);
app.use("/projects/", projectsRouter);
app.use("/designer/", designerRouter);
app.use("/position/", positionRouter);
app.use("/kp/", kpRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
