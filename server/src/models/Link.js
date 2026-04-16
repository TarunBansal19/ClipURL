const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    code: { type: String, unique: true, required: true },
    alias: { type: String, unique: true, sparse: true },
    originalUrl: { type: String, required: true },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", linkSchema);

