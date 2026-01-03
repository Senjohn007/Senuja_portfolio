// client/src/pages/admin/AdminProjectsPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetProjects,
  adminDeleteProject,
  adminCreateProject,
  adminUpdateProject,
} from "../../lib/adminProjectsApi";

function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // create form
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    techStack: "",
    demoUrl: "",
    repoUrl: "",
    imageUrl: "",
    problem: "",
    features: "",
    learnings: "",
  });
  const [saving, setSaving] = useState(false);

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    techStack: "",
    demoUrl: "",
    repoUrl: "",
    imageUrl: "",
    problem: "",
    features: "",
    learnings: "",
  });
  const [updating, setUpdating] = useState(false);

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

    const rawCategory = form.category.trim();
    const validCategory =
      ["Web", "Mobile", "Data", "PowerBI", "Other"].includes(rawCategory)
        ? rawCategory
        : "Web";

    // convert features textarea to array
    const featuresArray = form.features
      .split(/\r?\n|,/)
      .map((f) => f.trim())
      .filter(Boolean);

    // normalize image path
    const rawImage = form.imageUrl.trim();
    const normalizedImage =
      rawImage && !rawImage.startsWith("http") && !rawImage.startsWith("/")
        ? `/${rawImage}`
        : rawImage;

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
          repo: form.repoUrl.trim(),
        },
        images: normalizedImage ? [normalizedImage] : [],
        featured: false,
        problem: form.problem.trim(),
        features: featuresArray,
        learnings: form.learnings.trim(),
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
        imageUrl: "",
        problem: "",
        features: "",
        learnings: "",
      });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create project.");
    } finally {
      setSaving(false);
    }
  }

  const startEdit = (project) => {
    setEditingId(project._id);
    setEditForm({
      title: project.title || "",
      description: project.description || "",
      category: project.category || "",
      techStack: (project.techStack || []).join(", "),
      demoUrl: project.links?.demo || "",
      repoUrl: project.links?.repo || "",
      imageUrl: project.images?.[0] || "",
      problem: project.problem || "",
      features: (project.features || []).join("\n"),
      learnings: project.learnings || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      category: "",
      techStack: "",
      demoUrl: "",
      repoUrl: "",
      imageUrl: "",
      problem: "",
      features: "",
      learnings: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    if (
      !editForm.title.trim() ||
      !editForm.description.trim() ||
      !editForm.techStack.trim()
    ) {
      alert("Title, description and tech stack are required.");
      return;
    }

    const rawCategory = editForm.category.trim();
    const validCategory =
      ["Web", "Mobile", "Data", "PowerBI", "Other"].includes(rawCategory)
        ? rawCategory
        : "Web";

    const featuresArray = editForm.features
      .split(/\r?\n|,/)
      .map((f) => f.trim())
      .filter(Boolean);

    // normalize image path
    const rawImage = editForm.imageUrl.trim();
    const normalizedImage =
      rawImage && !rawImage.startsWith("http") && !rawImage.startsWith("/")
        ? `/${rawImage}`
        : rawImage;

    setUpdating(true);
    try {
      const payload = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        category: validCategory,
        techStack: editForm.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        links: {
          demo: editForm.demoUrl.trim() || "",
          repo: editForm.repoUrl.trim(),
        },
        images: normalizedImage ? [normalizedImage] : [],
        problem: editForm.problem.trim(),
        features: featuresArray,
        learnings: editForm.learnings.trim(),
      };

      const updatedRes = await adminUpdateProject(editingId, payload);
      const updated = updatedRes.data || updatedRes;

      setProjects((prev) =>
        prev.map((p) => (p._id === editingId ? updated : p))
      );
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update project.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Projects</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Manage your portfolio projects here. You can add, edit, and delete projects.
        </p>
      </div>

      {/* Create form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Project
        </h2>
        
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                <option value="">Select a category</option>
                <option value="Web">Web</option>
                <option value="Mobile">Mobile</option>
                <option value="Data">Data</option>
                <option value="PowerBI">PowerBI</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          {/* Problem */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Problem</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={form.problem}
              onChange={(e) =>
                setForm((f) => ({ ...f, problem: e.target.value }))
              }
              placeholder="Describe the real-world problem this project solves."
            />
          </div>

          {/* Features / Solution */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Features / Solution</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={form.features}
              onChange={(e) =>
                setForm((f) => ({ ...f, features: e.target.value }))
              }
              placeholder={
                "One feature per line, e.g.\nDashboard for real-time stats\nJWT-based authentication\nRole-based access control"
              }
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Each line becomes one bullet point in the Solution & features section.
            </p>
          </div>

          {/* Challenges & Learnings */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Challenges & learnings</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={form.learnings}
              onChange={(e) =>
                setForm((f) => ({ ...f, learnings: e.target.value }))
              }
              placeholder="Summarize key implementation challenges and what you learned."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tech stack</label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={form.techStack}
              onChange={(e) =>
                setForm((f) => ({ ...f, techStack: e.target.value }))
              }
              placeholder="React, Node, MongoDB"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Comma-separated list, e.g. React, Node, MongoDB.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Demo URL</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={form.demoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, demoUrl: e.target.value }))
                }
                placeholder="https://your-demo-link.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Repo URL <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={form.repoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, repoUrl: e.target.value }))
                }
                placeholder="https://github.com/you/project"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              placeholder="https://your-image-host.com/thumbnail.png"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Optional thumbnail or screenshot URL (first image shown on homepage).
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving..." : "Add project"}
            </button>
          </div>
        </form>
      </div>

      {/* Projects list */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Existing Projects</h2>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Loading projects...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {!loading && !projects.length && !error && (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-sm text-slate-500 dark:text-slate-400">No projects found.</p>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 transition-shadow hover:shadow-md"
              >
                {editingId === project._id ? (
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                        <input
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, title: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        <select
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, category: e.target.value }))
                          }
                        >
                          <option value="">Select a category</option>
                          <option value="Web">Web</option>
                          <option value="Mobile">Mobile</option>
                          <option value="Data">Data</option>
                          <option value="PowerBI">PowerBI</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                      <textarea
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, description: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Problem</label>
                      <textarea
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        value={editForm.problem}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, problem: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Features</label>
                      <textarea
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        value={editForm.features}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, features: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Learnings</label>
                      <textarea
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        value={editForm.learnings}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, learnings: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tech Stack</label>
                      <input
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        value={editForm.techStack}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, techStack: e.target.value }))
                        }
                      />
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Demo URL</label>
                        <input
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          value={editForm.demoUrl}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, demoUrl: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Repo URL</label>
                        <input
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          value={editForm.repoUrl}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, repoUrl: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                      <input
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        value={editForm.imageUrl}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, imageUrl: e.target.value }))
                        }
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                      >
                        {updating ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            Featured
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        {project.links?.repo && (
                          <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Repository
                          </a>
                        )}
                        {project.links?.demo && (
                          <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => startEdit(project)}
                        className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="inline-flex items-center justify-center rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProjectsPage;