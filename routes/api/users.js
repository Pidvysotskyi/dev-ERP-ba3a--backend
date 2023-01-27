const express = require("express");
const { users: ctrl, auth: authCtrl } = require("../../controllers");

const { validation, ctrlWrapper, auth } = require("../../middlewares");
const { updatePassSchema, newUserSchema } = require("../../schemas/");

const router = express.Router();

router.post("/add", auth, ctrlWrapper(ctrl.addUser));
router.patch("/changePass", validation(updatePassSchema), ctrlWrapper(ctrl.changePass), ctrlWrapper(authCtrl.login));
router.get("/getCurrentUser", auth, ctrlWrapper(ctrl.getCurrentUser));

module.exports = router;
