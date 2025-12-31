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

// POST /api/admin/skills
exports.createSkill = async (req, res) => {
  try {
    const { name, category, proficiency } = req.body;

    if (!name || !category || proficiency === undefined) {
      return res.status(400).json({
        message: "name, category and proficiency are required",
      });
    }

    const existing = await Skill.findOne({ name });
    if (existing) {
      return res.status(400).json({
        message: "Skill with this name already exists",
      });
    }

    const skill = await Skill.create({
      name,
      category,
      proficiency,
    });

    res.status(201).json({
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create skill",
      error: error.message,
    });
  }
};

// PUT /api/admin/skills/:id
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Skill.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({
      message: "Skill updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update skill",
      error: error.message,
    });
  }
};

// DELETE /api/admin/skills/:id
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Skill.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({
      message: "Skill deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete skill",
      error: error.message,
    });
  }
};
