const express = require("express");
const { todo: ctrl } = require("../../controllers");

const { ctrlWrapper, auth } = require("../../middlewares");

const router = express.Router();

router.post("/add", auth, ctrlWrapper(ctrl.addTodo));
router.patch("/update", auth, ctrlWrapper(ctrl.editTodo));
router.post("/test", ctrlWrapper(ctrl.test));

module.exports = router;
