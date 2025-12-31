// server/src/routes/projectRoutes.js
const express = require("express");
const router = express.Router();

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,  // ✅ add this
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route – for portfolio frontend
router.get("/", getProjects);

// Admin routes – will be used under /api/admin/projects
router.post("/", authMiddleware, createProject);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

// Public single-project route
router.get("/:id", getProjectById);

module.exports = router;
