const express = require("express");
const { kpa: ctrl } = require("../../controllers");

const { ctrlWrapper, auth } = require("../../middlewares");
const router = express.Router();

router.post("/add", auth, ctrlWrapper(ctrl.addKpa));
router.patch("/updateNote", auth, ctrlWrapper(ctrl.updateNote));
router.get("/getForKp/:kpKey", auth, ctrlWrapper(ctrl.getForKp));

module.exports = router;
