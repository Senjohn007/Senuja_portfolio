// src/App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardLayout from "./pages/admin/AdminDashboardLayout";

import AdminProjectsPage from "./pages/admin/AdminProjectsPage";
import AdminAchievementsPage from "./pages/admin/AdminAchievementsPage";
import AdminSkillsPage from "./pages/admin/AdminSkillsPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";



function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage />} />

      {/* Admin auth */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin dashboard layout + nested routes */}
      <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="achievements" element={<AdminAchievementsPage />} />
        <Route path="skills" element={<AdminSkillsPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
