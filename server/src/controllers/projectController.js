const Project = require("../models/Project");

// GET /api/projects
// Optional queries: ?category=Web&featured=true
exports.getProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// POST /api/admin/projects
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      techStack,
      links,
      images,
      category,
      featured,
    } = req.body;

    if (!title || !description || !techStack || !links || !links.repo || !category) {
      return res.status(400).json({
        message: "title, description, techStack, links.repo, and category are required",
      });
    }

    const project = await Project.create({
      title,
      description,
      techStack,
      links,
      images: images || [],
      category,
      featured: featured ?? false,
    });

    res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// PUT /api/admin/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// DELETE /api/admin/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};
