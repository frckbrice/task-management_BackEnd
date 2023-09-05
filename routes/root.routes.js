const express = require("express");
const router = express.Router();
const path = require("path");
const root = require("../controllers/index");

router.get("^/$|/index(.html)?", root.index);

module.exports = router;
