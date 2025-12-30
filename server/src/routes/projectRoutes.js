const express = require("express");
const router = express.Router();

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route – for portfolio frontend
// GET /api/projects
router.get("/", getProjects);

// Admin routes – will be used under /api/admin/projects
// POST /api/admin/projects
//And this will be protected by authMiddleware, and require JWT token access
router.post("/", authMiddleware, createProject);

// PUT /api/admin/projects/:id
router.put("/:id", authMiddleware, updateProject);

// DELETE /api/admin/projects/:id
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
