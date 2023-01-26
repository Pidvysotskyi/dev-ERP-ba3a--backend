const express = require("express");
const { orgStructure: ctrl } = require("../../controllers");

const { ctrlWrapper, auth } = require("../../middlewares");

const router = express.Router();

router.get("/getAll", auth, ctrlWrapper(ctrl.getAll));

module.exports = router;
