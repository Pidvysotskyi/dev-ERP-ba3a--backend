const express = require("express");
const { kp: ctrl } = require("../../controllers");

const { ctrlWrapper, auth } = require("../../middlewares");
// const { newClient } = require("../../schemas/");

const router = express.Router();

router.post("/add", auth, ctrlWrapper(ctrl.addKp));
router.patch("/updateNote", auth, ctrlWrapper(ctrl.updateNote));
router.get("/get/:kpKey", auth, ctrlWrapper(ctrl.getKp));
// router.get("/getAll", auth, ctrlWrapper(ctrl.getAll));
router.get("/getForProject/:projectKey", auth, ctrlWrapper(ctrl.getForProject));
// router.get("/getForUser/:userId", auth, ctrlWrapper(ctrl.getforUser));
// router.get("/getForCurrent", auth, ctrlWrapper(ctrl.getforCurrent));
// router.get("/getForOrg/:orgStructureId", auth, ctrlWrapper(ctrl.getforOrg));
router.delete("/delete/:kpKey", auth, ctrlWrapper(ctrl.deleteKp));

module.exports = router;
