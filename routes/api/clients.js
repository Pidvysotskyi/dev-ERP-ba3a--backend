const express = require("express");
const { clients: ctrl } = require("../../controllers");

const { ctrlWrapper } = require("../../middlewares");
// const { newPersonaSchema } = require("../../schemas/");

const router = express.Router();

// router.post("/add", validation(newPersonaSchema), ctrlWrapper(ctrl.addPersona));
router.get("/getAll", ctrlWrapper(ctrl.getAll));

module.exports = router;
