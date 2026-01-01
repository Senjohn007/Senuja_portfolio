// server/src/routes/githubRoutes.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

// GET /api/github/latest
router.get("/github/latest", async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME;
    if (!username) {
      return res
        .status(400)
        .json({ message: "GITHUB_USERNAME is not configured" });
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        params: { sort: "updated", per_page: 6 },
        headers: {
          "User-Agent": "portfolio-backend",
        },
      }
    );

    const mapped = response.data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
    }));

    res.json(mapped);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch GitHub repos" });
  }
});

module.exports = router;
