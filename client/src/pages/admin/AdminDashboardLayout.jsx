import { Outlet, NavLink } from "react-router-dom";

function AdminDashboardLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 p-4">
        <h2 className="font-semibold mb-4">Admin</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <NavLink to="projects">Projects</NavLink>
          <NavLink to="achievements">Achievements</NavLink>
          <NavLink to="skills">Skills</NavLink>
          <NavLink to="messages">Messages</NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboardLayout;
