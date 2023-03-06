const express = require("express");
const { kp: ctrl } = require("../../controllers");

const { ctrlWrapper, auth } = require("../../middlewares");

const router = express.Router();

router.post("/add", auth, ctrlWrapper(ctrl.addKp));
router.patch("/updateNote", auth, ctrlWrapper(ctrl.updateNote));
router.patch("/update", auth, ctrlWrapper(ctrl.uppdateKp));
router.get("/get/:kpKey", auth, ctrlWrapper(ctrl.getKp));
router.get("/getForProject/:projectKey", auth, ctrlWrapper(ctrl.getForProject));
router.get("/getForUser/:userId", auth, ctrlWrapper(ctrl.getforUser));
router.get("/getForCurrent", auth, ctrlWrapper(ctrl.getForCurrent));
router.get("/getSubKp/:kpKey", auth, ctrlWrapper(ctrl.getSubKp));

module.exports = router;
