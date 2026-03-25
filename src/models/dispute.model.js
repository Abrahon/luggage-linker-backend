const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reason: String,
  status: {
    type: String,
    enum: ["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"],
    default: "OPEN"
  },
  adminNotes: String,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  resolvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Dispute", disputeSchema);