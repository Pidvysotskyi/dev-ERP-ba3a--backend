const express = require("express");
const { projects: ctrl } = require("../../controllers");

const { ctrlWrapper, auth } = require("../../middlewares");
// const { newClient } = require("../../schemas/");

const router = express.Router();

router.post("/add", auth, ctrlWrapper(ctrl.addProject));
router.get("/get/:projectKey", auth, ctrlWrapper(ctrl.getProject));
router.get("/getAll", auth, ctrlWrapper(ctrl.getAll));
router.get("/getForClient/:clientId", auth, ctrlWrapper(ctrl.getforClient));
router.get("/getForUser/:userId", auth, ctrlWrapper(ctrl.getforUser));

module.exports = router;