const Skill = require("../models/Skill");

// GET /api/skills
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, proficiency: -1 });

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message,
    });
  }
};
