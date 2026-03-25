const mongoose = require("mongoose");

const travelerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },
  bio: String,
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalTrips: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("TravelerProfile", travelerProfileSchema);