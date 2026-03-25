const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },
  confirmedBySender: { type: Boolean, default: false },
  confirmedByTraveler: { type: Boolean, default: false },
  confirmedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Delivery", deliverySchema);
