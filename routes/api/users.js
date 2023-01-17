const express = require("express");
const { users: ctrl, auth: authCtrl } = require("../../controllers");

const { validation, ctrlWrapper, auth } = require("../../middlewares");
const { updatePassSchema } = require("../../schemas/");

const router = express.Router();

router.patch("/changePass", validation(updatePassSchema), ctrlWrapper(ctrl.changePass), ctrlWrapper(authCtrl.login));

module.exports = router;
