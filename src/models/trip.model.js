const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    // 👤 WHO IS CARRYING THE PACKAGE (TRAVELER / CARRIER)
    traveler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📍 ROUTE
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    // 📅 TRAVEL TIME
    departureDate: {
      type: Date,
      required: true,
    },

    arrivalDate: {
      type: Date,
    },

    // 📦 CARRIER CAPACITY
    luggageCapacityKg: {
      type: Number,
      required: true,
      min: 0,
    },

    availableCapacityKg: {
      type: Number,
      required: true,
      min: 0,
    },

    // 📝 NOTE (IMPORTANT ADDITION)
    note: {
      type: String,
      maxlength: 500,
      default: "",
    },

    // 🚚 CARRIER STATUS CONTROL
    status: {
      type: String,
      enum: ["OPEN", "BOOKED", "IN_TRANSIT", "COMPLETED", "CANCELLED"],
      default: "OPEN",
    },

    // 🔐 SECURITY / BUSINESS CONTROL
    isActive: {
      type: Boolean,
      default: true,
    },

    // 💰 OPTIONAL: PRICE PER KG (FOR CARRIER EARNING MODEL)
    pricePerKg: {
      type: Number,
      default: 0,
    },

    // 📊 TRACKING
    bookingsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);