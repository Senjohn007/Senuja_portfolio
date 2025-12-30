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
