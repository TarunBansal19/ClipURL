const express = require("express");
const {
  shorten,
  listUserLinks,
  deleteLink,
  updateLink,
  getStats
} = require("../controllers/linksController");
const authMiddleware = require("../middleware/authMiddleware");
const unauthShortenLimiter = require("../middleware/rateLimiter");
const optionalAuth = require("../middleware/optionalAuth");

const router = express.Router();

router.post("/shorten", optionalAuth, unauthShortenLimiter, shorten);
router.get("/links", authMiddleware, listUserLinks);
router.delete("/links/:code", authMiddleware, deleteLink);
router.patch("/links/:code", authMiddleware, updateLink);
router.get("/links/:code/stats", authMiddleware, getStats);

module.exports = router;
