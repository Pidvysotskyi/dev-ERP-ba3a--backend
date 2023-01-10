const { Project } = require("../../models");

const addProject = async (req, res, next) => {
  const { ID_DEP_CLIENT } = req.body;
  const [projects, _] = await Project.getAll();
  const date = new Date();
  const stringDate = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("");
  const todaysProjects = projects.filter(item => item.ID_PROJECT.split("_")[1] === stringDate);
  const ID = todaysProjects.length + 1;
  const ID_PROJECT = `${ID_DEP_CLIENT}_${stringDate}`;

  const project = new Project(ID, ID_DEP_CLIENT, ID_PROJECT);
  await project.add();

  res.json({
    message: "Succesfuly added",
    project,
  });
};

module.exports = addProject;
