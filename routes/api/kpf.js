const express = require("express");
const { kpf: ctrl } = require("../../controllers");

const { ctrlWrapper, auth } = require("../../middlewares");
const router = express.Router();

router.post("/add", auth, ctrlWrapper(ctrl.addKpf));
router.patch("/updateNote", auth, ctrlWrapper(ctrl.updateNote));
router.get("/getForKp/:kpKey", auth, ctrlWrapper(ctrl.getForKp));

module.exports = router;
