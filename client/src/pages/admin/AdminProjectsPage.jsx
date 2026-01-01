// client/src/pages/admin/AdminProjectsPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetProjects,
  adminDeleteProject,
  adminCreateProject,
} from "../../lib/adminProjectsApi";

function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    techStack: "",
    demoUrl: "",
    repoUrl: "",
  });
  const [saving, setSaving] = useState(false);

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

  async function handleCreate(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.techStack.trim()) {
      alert("Title, description and tech stack are required.");
      return;
    }

    // category must be one of the enum values
    const rawCategory = form.category.trim();
    const validCategory =
      ["Web", "Mobile", "Data", "PowerBI", "Other"].includes(rawCategory)
        ? rawCategory
        : "Web";

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: validCategory,
        techStack: form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        links: {
          demo: form.demoUrl.trim() || "",
          repo: form.repoUrl.trim(), // required
        },
        images: [],
        featured: false,
      };

      const createdRes = await adminCreateProject(payload);
      const created = createdRes.data || createdRes;

      setProjects((prev) => [created, ...prev]);
      setForm({
        title: "",
        description: "",
        category: "",
        techStack: "",
        demoUrl: "",
        repoUrl: "",
      });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Projects</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Manage your portfolio projects here. You can add, view, and delete projects.
      </p>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium">Title</label>
            <input
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Category</label>
            <input
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              placeholder="Web, Mobile, Data, PowerBI, Other"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block font-medium">Description</label>
          <textarea
            rows={3}
            className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Tech stack</label>
          <input
            className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={form.techStack}
            onChange={(e) =>
              setForm((f) => ({ ...f, techStack: e.target.value }))
            }
            placeholder="React, Node, MongoDB"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Comma-separated list, e.g. React, Node, MongoDB.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium">Demo URL</label>
            <input
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.demoUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, demoUrl: e.target.value }))
              }
              placeholder="https://your-demo-link.com"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">
              Repo URL <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.repoUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, repoUrl: e.target.value }))
              }
              placeholder="https://github.com/you/project"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add project"}
          </button>
        </div>
      </form>

      {loading && (
        <p className="text-sm text-slate-500">Loading projects...</p>
      )}

      {error && (
        <p className="mb-2 text-sm text-red-500">{error}</p>
      )}

      {!loading && !projects.length && !error && (
        <p className="text-sm text-slate-500">No projects found.</p>
      )}

      {!loading && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
            >
              <div>
                <h2 className="text-sm font-semibold">
                  {project.title}
                  {project.featured && (
                    <span className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">
                      Featured
                    </span>
                  )}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                  {project.description}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Category: {project.category}
                </p>
              </div>

              <button
                onClick={() => handleDelete(project._id)}
                className="rounded bg-red-500 px-2 py-1 text-[11px] text-white hover:bg-red-600"
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
