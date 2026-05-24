

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // 👤 WHO SENDING REQUEST
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🚚 CARRIER (TRIP OWNER)
    traveler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🚚 RELATED TRIP
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    // 📦 PACKAGE DETAILS
    weightKg: {
      type: Number,
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],

    price: {
      type: Number,
      default: 0,
    },

    // 📊 STATUS FLOW
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
      default: "PENDING",
    },

    // 🧠 OPTIONAL TRACKING
    rejectedReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
