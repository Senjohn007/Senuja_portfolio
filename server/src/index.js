require("dotenv").config(); // loads /server/.env

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// route imports
const projectRoutes = require("./routes/projectRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const skillRoutes = require("./routes/skillRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to MongoDB
connectDB();

// basic test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API routes
app.use("/api/projects", projectRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/messages", messageRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
