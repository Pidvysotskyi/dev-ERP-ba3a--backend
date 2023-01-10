const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  const data = [
    {
      name: "Oleksandr",
      phone: "+380961126851",
    },
    {
      name: "Svitlana",
      phone: "+380967507311",
    },
  ];
  res.json(data);
});

module.exports = router;
