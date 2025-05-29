const mongoose = require("mongoose");

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  points: { type: Number, default: 1000 },
  lastReset: { type: Date, default: Date.now },
  ipList: [
    {
      ip: { type: String },
      time: { type: Date },
    }
  ],
});

module.exports = mongoose.model("RateLimit", rateLimitSchema);
