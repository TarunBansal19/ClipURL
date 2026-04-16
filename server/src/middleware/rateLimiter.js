const rateLimit = require("express-rate-limit");

const unauthShortenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => Boolean(req.headers.authorization),
  message: { error: "Too many requests. Try again later." }
});

module.exports = unauthShortenLimiter;
