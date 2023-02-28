const { Project } = require("../../models");

const test = (req, res, next) => {
  console.log("test is run");
  console.log(Project);

  const newProject = new Project({});

  console.log(newProject);

  res.json({
    message: "test done, see the console",
  });
};

module.exports = test;
