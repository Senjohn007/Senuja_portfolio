const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    techStack: {
      type: [String], // e.g. ["React", "Node", "MongoDB"]
      required: true,
    },

    links: {
      demo: {
        type: String,
      },
      repo: {
        type: String,
        required: true,
      },
    },

    images: {
      type: [String], // Cloudinary / image URLs
      default: [],
    },

    category: {
      type: String,
      enum: ["Web", "Mobile", "Data", "PowerBI", "Other"],
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("Project", projectSchema);
