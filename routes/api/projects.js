const express = require("express");
const { projects: ctrl } = require("../../controllers");
const { ctrlWrapper } = require("../../middlewares");

const router = express.Router();

router.get("/", ctrlWrapper(ctrl.getProjects));

router.post("/", ctrlWrapper(ctrl.addProject));

module.exports = router;
