const express = require("express");
const router = express.Router();

const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route – used by portfolio UI
// GET /api/skills
router.get("/", getSkills);

// Admin routes – will be used under /api/admin/skills
// POST /api/admin/skills
router.post("/", authMiddleware, createSkill);

// PUT /api/admin/skills/:id
router.put("/:id", authMiddleware, updateSkill);

// DELETE /api/admin/skills/:id
router.delete("/:id", authMiddleware, deleteSkill);

module.exports = router;
