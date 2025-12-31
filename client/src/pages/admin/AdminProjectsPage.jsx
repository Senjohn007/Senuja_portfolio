// client/src/pages/admin/AdminProjectsPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetProjects,
  adminDeleteProject,
} from "../../lib/adminProjectsApi";

function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch projects on mount
  useEffect(() => {
    let ignore = false;

    const loadProjects = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminGetProjects();
        if (!ignore) setProjects(data);
      } catch (err) {
        console.error(err);
        if (!ignore) setError("Failed to load projects.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProjects();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await adminDeleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Projects</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Manage your portfolio projects here. You can view and delete projects.
      </p>

      {loading && (
        <p className="text-sm text-slate-500">Loading projects...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}

      {!loading && !projects.length && !error && (
        <p className="text-sm text-slate-500">No projects found.</p>
      )}

      {!loading && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-start justify-between gap-3"
            >
              <div>
                <h2 className="text-sm font-semibold">
                  {project.title}
                  {project.featured && (
                    <span className="ml-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Featured
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                  {project.description}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Category: {project.category}
                </p>
              </div>

              <button
                onClick={() => handleDelete(project._id)}
                className="text-[11px] px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProjectsPage;
