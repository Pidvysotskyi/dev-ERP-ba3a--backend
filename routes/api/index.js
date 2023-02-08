const authRouter = require("./auth");
const usersRouter = require("./users");
const personaRouter = require("./persona");
const clientsRouter = require("./clients");
const orgStructureRouter = require("./orgStructure");
const projectsRouter = require("./projects");
const designerRouter = require("./designer");
const positionRouter = require("./position");
const kpRouter = require("./kp");

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
};
