// src/pages/admin/AdminDashboardLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminDashboardLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("portfolio_admin_token");
    navigate("/");
  }

  const linkBase =
    "block rounded-md px-3 py-2 text-xs font-medium transition-colors";
  const linkInactive =
    "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";
  const linkActive =
    "bg-sky-600 text-white dark:bg-sky-500";

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 p-4 hidden md:flex md:flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h2>
          <button
            onClick={handleLogout}
            className="text-[11px] rounded bg-slate-200 px-2 py-1 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Logout
          </button>
        </div>

        <nav className="flex flex-col gap-1 text-sm">
          <NavLink
            to="projects"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="achievements"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Achievements
          </NavLink>
          <NavLink
            to="skills"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Skills
          </NavLink>
          <NavLink
            to="messages"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Messages
          </NavLink>

          <NavLink
  to="settings"
  className={({ isActive }) =>
    `${linkBase} ${isActive ? linkActive : linkInactive}`
  }
>
  Settings
</NavLink>
        </nav>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Admin Dashboard
        </span>
        <button
          onClick={handleLogout}
          className="text-[11px] rounded bg-slate-200 px-2 py-1 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Logout
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboardLayout;
