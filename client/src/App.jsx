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
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { useTheme } from "./context/ThemeContext";


function App() {

   const { themeTransition } = useTheme();

  return (
     <div className={`min-h-screen ${themeTransition ? 'theme-transition' : ''}`}>

    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage />} />

      {/* Admin auth (public) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected admin dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="achievements" element={<AdminAchievementsPage />} />
          <Route path="skills" element={<AdminSkillsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>
    </Routes>

    </div>
  );
}

export default App;
