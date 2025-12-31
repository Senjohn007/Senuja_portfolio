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

// POST /api/admin/achievements
exports.createAchievement = async (req, res) => {
  try {
    const {
      title,
      issuer,
      date,
      description,
      certificateUrl,
      type,
    } = req.body;

    if (!title || !issuer || !date || !type) {
      return res.status(400).json({
        message: "title, issuer, date, and type are required",
      });
    }

    const achievement = await Achievement.create({
      title,
      issuer,
      date,
      description,
      certificateUrl,
      type,
    });

    res.status(201).json({
      message: "Achievement created successfully",
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create achievement",
      error: error.message,
    });
  }
};

// PUT /api/admin/achievements/:id
exports.updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Achievement.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.status(200).json({
      message: "Achievement updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update achievement",
      error: error.message,
    });
  }
};

// DELETE /api/admin/achievements/:id
exports.deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Achievement.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.status(200).json({
      message: "Achievement deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete achievement",
      error: error.message,
    });
  }
};
