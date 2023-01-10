const express = require("express");
const { clients: ctrl } = require("../../controllers");
const { ctrlWrapper } = require("../../middlewares");

const router = express.Router();

router.get("/", ctrlWrapper(ctrl.getClients));

module.exports = router;
