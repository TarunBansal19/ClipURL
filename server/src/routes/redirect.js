const express = require("express");
const { redirectByCode } = require("../controllers/redirectController");

const router = express.Router();

router.get("/:code", redirectByCode);

module.exports = router;
