const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  const data = [
    {
      name: "Oleksandr",
      role: "backend",
    },
    {
      name: "Victoria",
      role: "frontend",
    },
    {
      name: "Dmitriy",
      role: "database",
    },
    {
      name: "Stanislav",
      role: "admin",
    },
    {
      name: "Viacheslav",
      role: "project manager",
    },
  ];
  res.json(data);
});

module.exports = router;
