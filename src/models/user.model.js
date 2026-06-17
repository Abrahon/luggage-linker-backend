
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================
    // BASIC INFO
    // =====================================

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    country: {
      type: String,
    },

    city: {
      type: String,
    },

    // =====================================
    // ROLE
    // =====================================

    role: {
      type: String,
      enum: ["sender", "carrier", "admin"],
      default: "sender",
    },

    // =====================================
    // MEMBERSHIP
    // =====================================

    membership: {
      tier: {
        type: String,
        enum: ["free", "silver", "gold", "platinum"],
        default: "free",
      },

      planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MembershipPlan",
      },

      subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
      },

      status: {
        type: String,
        enum: [
          "trial",
          "active",
          "expired",
          "cancelled",
        ],
        default: "trial",
      },

      startedAt: Date,

      expiresAt: Date,

      autoRenew: {
        type: Boolean,
        default: false,
      },
    },

    // =====================================
    // VERIFICATION
    // =====================================

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    passportNumber: {
      type: String,
    },

    passportImage: {
      type: String,
    },

    nationalIdImage: {
      type: String,
    },

    // =====================================
    // AUTH TOKENS
    // =====================================

    verificationToken: String,

    verificationTokenExpire: Date,

    otp: String,

    otpExpire: Date,

    resetToken: String,

    resetTokenExpire: Date,

    refreshToken: String,

    // =====================================
    // MARKETPLACE STATS
    // =====================================

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    completedDeliveries: {
      type: Number,
      default: 0,
    },

    cancelledDeliveries: {
      type: Number,
      default: 0,
    },

    responseRate: {
      type: Number,
      default: 0,
    },

    // =====================================
    // WALLET
    // =====================================

    walletBalance: {
      type: Number,
      default: 0,
    },

    pendingBalance: {
      type: Number,
      default: 0,
    },

    // =====================================
    // ACCOUNT STATUS
    // =====================================

    accountStatus: {
      type: String,
      enum: [
        "active",
        "suspended",
        "blocked",
        "deleted",
      ],
      default: "active",
    },

    lastLogin: Date,

    // =====================================
    // NOTIFICATION SETTINGS
    // =====================================

    notificationSettings: {
      email: {
        type: Boolean,
        default: true,
      },

      sms: {
        type: Boolean,
        default: true,
      },

      push: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);