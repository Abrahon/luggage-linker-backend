const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    // 👤 LINK TO USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 👤 BASIC PROFILE INFO
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    profilePhoto: {
      type: String, // URL (Cloudinary / S3 / local)
      default: "",
    },

    bio: {
      type: String,
      maxlength: 250,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // 📊 EXTRA INFO (OPTIONAL)
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dateOfBirth: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);