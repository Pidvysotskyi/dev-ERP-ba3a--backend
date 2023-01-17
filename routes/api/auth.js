const express = require("express");
const { auth: ctrl } = require("../../controllers");
const { validation, ctrlWrapper, auth } = require("../../middlewares");
const { newUserSchema, loginUserSchema } = require("../../schemas/");

const router = express.Router();

// router.post("/register", validation(newUserSchema), ctrlWrapper(ctrl.signup));
router.post("/login", ctrlWrapper(ctrl.firstLogin), ctrlWrapper(ctrl.login));
router.post("/logout", auth, ctrlWrapper(ctrl.logout));

module.exports = router;
