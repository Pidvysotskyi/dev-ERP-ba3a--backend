const express = require("express");
const { contracts: ctrl } = require("../../controllers");
const { upload } = require("../../middlewares/");

const { ctrlWrapper, auth } = require("../../middlewares");
// const { newClient } = require("../../schemas/");

const router = express.Router();

router.post("/add", auth, upload.array("contract", 10), ctrlWrapper(ctrl.addContract));
router.patch("/update", auth, upload.array("contract", 10), ctrlWrapper(ctrl.editContract));

module.exports = router;
