const express = require("express");
const { einfo: ctrl } = require("../../controllers");
const { upload } = require("../../middlewares/");

const { ctrlWrapper, auth } = require("../../middlewares");

const router = express.Router();

router.post("/add", auth, upload.array("screenshot", 10), ctrlWrapper(ctrl.addEinfo));
router.patch("/update", auth, upload.array("screenshot", 10), ctrlWrapper(ctrl.editEinfo));

module.exports = router;
