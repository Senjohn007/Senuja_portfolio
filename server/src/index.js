require("dotenv").config(); // loads /server/.env

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// route imports
const projectRoutes = require("./routes/projectRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const skillRoutes = require("./routes/skillRoutes");
const messageRoutes = require("./routes/messageRoutes");

//admin routes
const adminRoutes = require('./routes/adminRoutes');

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
app.use("/api/achievements", achievementRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/messages", messageRoutes);

// Public prefixes for routes
app.use("/api/projects", projectRoutes);
app.use("/api/achievements", achievementRoutes);   
app.use("/api/skills", skillRoutes);       
app.use("/api/messages", messageRoutes);          


// Admin prefix (JWT protected inside the router)
app.use("/api/admin/projects", projectRoutes);
app.use("/api/admin/achievements", achievementRoutes); 
app.use("/api/admin/messages", messageRoutes);  
app.use("/api/admin/skills", skillRoutes);        
  

//admin API routes (admin auth)
app.use('/api/admin', adminRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
