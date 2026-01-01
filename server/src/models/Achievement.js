// server/src/models/Achievement.js
const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    issuer: {
      type: String,
      required: true, // e.g. Cisco, Coursera, University
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
    },

    certificateUrl: {
      type: String, // PDF or image link
    },

    type: {
      type: String,
      enum: ["Certificate", "Award", "Competition", "Academic"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);
