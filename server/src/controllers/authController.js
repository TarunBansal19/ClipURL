const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) =>
  jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), passwordHash });
    const token = signToken(user);
    return res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login };
