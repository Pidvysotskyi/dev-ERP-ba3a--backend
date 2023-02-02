const express = require("express");
const { designer: ctrl } = require("../../controllers");

const { ctrlWrapper, auth } = require("../../middlewares");
// const { newClient } = require("../../schemas/");

const router = express.Router();

// router.post("/add", auth, ctrlWrapper(ctrl.addClient));
router.get("/getAll", auth, ctrlWrapper(ctrl.getAll));

module.exports = router;
