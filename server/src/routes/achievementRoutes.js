const express = require("express");
const router = express.Router();

const {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require("../controllers/achievementController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route – used by portfolio UI
// GET /api/achievements
router.get("/", getAchievements);

// Admin routes – will be used under /api/admin/achievements
// POST /api/admin/achievements
//And this will be protected by authMiddleware, and require JWT token access
router.post("/", authMiddleware, createAchievement);

// PUT /api/admin/achievements/:id
router.put("/:id", authMiddleware, updateAchievement);

// DELETE /api/admin/achievements/:id
router.delete("/:id", authMiddleware, deleteAchievement);

module.exports = router;
