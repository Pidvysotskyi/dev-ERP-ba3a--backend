const express = require("express");
const { persona: ctrl } = require("../../controllers");

const { validation, ctrlWrapper, auth } = require("../../middlewares");
const { newPersonaSchema } = require("../../schemas/");

const router = express.Router();

router.post("/add", auth, validation(newPersonaSchema), ctrlWrapper(ctrl.addPersona));
router.get("/getAll", ctrlWrapper(ctrl.getAll));

module.exports = router;
