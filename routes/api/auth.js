const express = require("express");
const { auth: ctrl } = require("../../controllers");
const { validation, ctrlWrapper, auth } = require("../../middlewares");
const { loginUserSchema } = require("../../schemas/");

const router = express.Router();

router.post("/register", auth, ctrlWrapper(ctrl.register));
router.post("/login", validation(loginUserSchema), ctrlWrapper(ctrl.firstLogin), ctrlWrapper(ctrl.login));
router.post("/logout", auth, ctrlWrapper(ctrl.logout));

module.exports = router;
