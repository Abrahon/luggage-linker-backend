// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   conversation: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Conversation"
//   },
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },
//   message: String,
//   isRead: { type: Boolean, default: false }
// }, { timestamps: true });

// module.exports = mongoose.model("Message", messageSchema);


const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    placeId: {
      type: String,
      default: null,
    },

    city: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    lat: {
      type: Number,
      default: null,
    },

    lng: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// prevent duplicate locations
locationSchema.index({ name: 1, city: 1, country: 1 }, { unique: true });

module.exports = mongoose.model("Location", locationSchema);