const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);
