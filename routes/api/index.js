const authRouter = require("./auth");
const usersRouter = require("./users");
const personaRouter = require("./persona");
const clientsRouter = require("./clients");
const orgStructureRouter = require("./orgStructure");
const projectsRouter = require("./projects");
const designerRouter = require("./designer");
const positionRouter = require("./position");
const kpRouter = require("./kp");
const contractsRouter = require("./contracts");
const annexesRouter = require("./annexes");
const einfoRouter = require("./einfo");
const todoRouter = require("./todo");
const kpaRouter = require("./kpa");
const kpfRouter = require("./kpf");
const todoKpRouter = require("./todoKp");

module.exports = {
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
};
