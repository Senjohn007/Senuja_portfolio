const express = require("express");
const router = express.Router();

const {
  createMessage,   // public: contact form
  getMessages,     // admin: list
  markMessageRead, // admin: mark as read
  deleteMessage, // admin: delete
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route – contact form on portfolio
// POST /api/messages
router.post("/", createMessage);

// Admin routes – will be used under /api/admin/messages
// GET /api/admin/messages
router.get("/", authMiddleware, getMessages);

// PUT /api/admin/messages/:id
router.put("/:id", authMiddleware, markMessageRead);

// DELETE /api/admin/messages/:id
router.delete("/:id", authMiddleware, deleteMessage); 

module.exports = router;
