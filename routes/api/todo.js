const express = require("express");
const { todo: ctrl } = require("../../controllers");
const { upload } = require("../../middlewares/");

const { ctrlWrapper, auth } = require("../../middlewares");

const router = express.Router();

router.post("/add", auth, upload.array("annex", 10), ctrlWrapper(ctrl.addTodo));
router.patch("/update", auth, upload.array("annex", 10), ctrlWrapper(ctrl.editTodo));

module.exports = router;

//Open
//in work
//In Review
//Approved
//Done
