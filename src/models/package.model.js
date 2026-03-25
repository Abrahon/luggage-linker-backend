const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location"
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location"
  },
  weightKg: Number,
  description: String,
  itemValue: Number,
  proposedPrice: Number,
  status: {
    type: String,
    enum: [
      "PENDING",
      "MATCHED",
      "IN_TRANSIT",
      "DELIVERED",
      "CANCELLED",
      "DISPUTED"
    ],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("Package", packageSchema);
