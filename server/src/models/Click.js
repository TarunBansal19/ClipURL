const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true },
  clickedAt: { type: Date, default: Date.now },
  country: String,
  deviceType: String
});

module.exports = mongoose.model("Click", clickSchema);
