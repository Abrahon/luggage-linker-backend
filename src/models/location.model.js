const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: {                 // 🔥 ADD THIS
    type: String,
    required: true,
  },
  country: String,
  city: String,
  airportCode: String,
  latitude: Number,
  longitude: Number,
}, { timestamps: true });

module.exports = mongoose.model("Location", locationSchema);