const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    // =====================================
    // USER REFERENCE
    // =====================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // =====================================
    // PROFILE MEDIA
    // =====================================

    profilePhoto: {
      type: String,
      default: "",
    },

    coverPhoto: {
      type: String,
      default: "",
    },

    // =====================================
    // PERSONAL INFO
    // =====================================

    bio: {
      type: String,
      maxlength: 500,
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

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dateOfBirth: {
      type: Date,
    },

    // =====================================
    // TRAVELER DETAILS
    // =====================================

    languages: [
      {
        type: String,
      },
    ],

    preferredAirlines: [
      {
        type: String,
      },
    ],

    preferredAirports: [
      {
        type: String,
      },
    ],

    // =====================================
    // SOCIAL LINKS
    // =====================================

    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
      telegram: String,
    },

    // =====================================
    // EMERGENCY CONTACT
    // =====================================

    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Profile",
  profileSchema
);