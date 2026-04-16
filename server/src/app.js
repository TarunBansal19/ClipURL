const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const linkRoutes = require("./routes/links");
const redirectRoutes = require("./routes/redirect");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api", linkRoutes);
app.use("/", redirectRoutes);

app.use(errorHandler);

module.exports = app;

