const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const {
  authRouter,
  usersRouter,
  personaRouter,
  clientsRouter,
  orgStructureRouter,
  projectsRouter,
  designerRouter,
  positionRouter,
  kpRouter,
  contractsRouter,
  annexesRouter,
  einfoRouter,
  todoRouter,
  kpaRouter,
  kpfRouter,
  todoKpRouter,
} = require("./routes/api/");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("storage"));

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/persona", personaRouter);
app.use("/clients", clientsRouter);
app.use("/orgStructure", orgStructureRouter);
app.use("/projects", projectsRouter);
app.use("/designer", designerRouter);
app.use("/position", positionRouter);
app.use("/kp", kpRouter);
app.use("/kp/a", kpaRouter);
app.use("/kp/f", kpfRouter);
app.use("/contracts", contractsRouter);
app.use("/annexes", annexesRouter);
app.use("/einfo", einfoRouter);
app.use("/todo", todoRouter);
app.use("/todo/kp", todoKpRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
