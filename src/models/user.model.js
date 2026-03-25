const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["sender", "receiver", "admin"], default: "sender" },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpire: Date,
    otp: String,
    otpExpire: Date,
    refreshToken: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
