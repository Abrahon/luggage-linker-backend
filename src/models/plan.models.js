const mongoose = require("mongoose");

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["free", "silver", "gold", "platinum"],
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    displayName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    monthlyPrice: {
      type: Number,
      default: 0,
    },

    yearlyPrice: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "USD",
    },

    platformFeePercentage: {
      type: Number,
      required: true,
      default: 15,
    },

    priorityBoost: {
      type: Number,
      default: 0,
    },

    maxActiveTrips: {
      type: Number,
      default: 1,
    },

    maxActivePackages: {
      type: Number,
      default: 2,
    },

    maxPhotosPerPackage: {
      type: Number,
      default: 3,
    },

    unlimitedTrips: {
      type: Boolean,
      default: false,
    },

    unlimitedPackages: {
      type: Boolean,
      default: false,
    },

    featuredListing: {
      type: Boolean,
      default: false,
    },

    prioritySupport: {
      type: Boolean,
      default: false,
    },

    fastVerification: {
      type: Boolean,
      default: false,
    },

    analyticsAccess: {
      type: Boolean,
      default: false,
    },

    insuranceCoverage: {
      type: Boolean,
      default: false,
    },

    supportLevel: {
      type: String,
      enum: ["basic", "priority", "vip"],
      default: "basic",
    },

    features: [
      {
        type: String,
      },
    ],

    badgeColor: {
      type: String,
      default: "#000000",
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MembershipPlan",
  membershipPlanSchema
);