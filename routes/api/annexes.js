const express = require("express");
const { annexes: ctrl } = require("../../controllers");
const { upload } = require("../../middlewares/");

const { ctrlWrapper, auth } = require("../../middlewares");

const router = express.Router();

router.post("/add", auth, upload.array("annex", 10), ctrlWrapper(ctrl.addAnnex));
router.patch("/update", auth, upload.array("annex", 10), ctrlWrapper(ctrl.editAnnex));

module.exports = router;
