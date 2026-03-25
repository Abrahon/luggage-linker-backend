const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  amount: Number,
  platformFee: Number,
  gateway: String,
  gatewayTransactionId: String,
  status: {
    type: String,
    enum: ["PENDING", "HELD", "RELEASED", "REFUNDED", "FAILED"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
