const getAll = require("./getAll");
const addProject = require("./addProject");
const getProject = require("./getProject");
const getforClient = require("./getForClient");
const getforUser = require("./getForUser");
const getforOrg = require("./getForOrg");
const deleteProject = require("./deleteProject");
const getforCurrent = require("./getForCurrent");
const changeStatus = require("./changeStatus");
const updateProject = require("./updateProject");

module.exports = {
  getAll,
  addProject,
  getProject,
  getforClient,
  getforUser,
  getforOrg,
  deleteProject,
  getforCurrent,
  changeStatus,
  updateProject,
};
