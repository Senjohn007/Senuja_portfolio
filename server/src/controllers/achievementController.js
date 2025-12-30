const Achievement = require("../models/Achievement");

// GET /api/achievements
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 });

    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch achievements",
      error: error.message,
    });
  }
};
