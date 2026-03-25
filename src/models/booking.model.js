const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip"
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package"
  },
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  agreedPrice: Number,
  platformFee: Number,
  travelerEarning: Number,
  status: {
    type: String,
    enum: [
      "REQUESTED",
      "ACCEPTED",
      "PAYMENT_HELD",
      "IN_TRANSIT",
      "DELIVERED",
      "COMPLETED",
      "CANCELLED",
      "DISPUTED"
    ],
    default: "REQUESTED"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
