const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // prevents duplicate skills
      trim: true,
    },

    category: {
      type: String,
      enum: ["Frontend", "Backend", "Tools", "Data"],
      required: true,
    },

    proficiency: {
      type: Number,
      min: 1,
      max: 100, // percentage-based skill level
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
