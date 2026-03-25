const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  traveler: {
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
  departureDate: Date,
  arrivalDate: Date,
  luggageCapacityKg: Number,
  availableCapacityKg: Number,
  status: {
    type: String,
    enum: ["OPEN", "BOOKED", "COMPLETED", "CANCELLED"],
    default: "OPEN"
  }
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);
