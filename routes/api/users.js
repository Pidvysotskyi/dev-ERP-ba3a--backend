const express = require("express");
const { users: ctrl, auth: authCtrl } = require("../../controllers");

const { validation, ctrlWrapper, auth } = require("../../middlewares");
const { newUserSchema, loginUserSchema } = require("../../schemas/");

const router = express.Router();

// router.post("/register", validation(newUserSchema), ctrlWrapper(ctrl.signup));
router.patch("/changePass", ctrlWrapper(ctrl.changePass), ctrlWrapper(authCtrl.login));
// router.post("/logout", auth, ctrlWrapper(ctrl.signout));

module.exports = router;
