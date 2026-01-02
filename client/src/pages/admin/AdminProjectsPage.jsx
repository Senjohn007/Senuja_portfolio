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
    <div>
      <h1 className="text-lg font-semibold mb-3">Projects</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Manage your portfolio projects here. You can add, edit, and delete projects.
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

        {/* Problem */}
        <div>
          <label className="mb-1 block font-medium">Problem</label>
          <textarea
            rows={3}
            className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={form.problem}
            onChange={(e) =>
              setForm((f) => ({ ...f, problem: e.target.value }))
            }
            placeholder="Describe the real-world problem this project solves."
          />
        </div>

        {/* Features / Solution */}
        <div>
          <label className="mb-1 block font-medium">Features / Solution</label>
          <textarea
            rows={3}
            className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={form.features}
            onChange={(e) =>
              setForm((f) => ({ ...f, features: e.target.value }))
            }
            placeholder={
              "One feature per line, e.g.\nDashboard for real-time stats\nJWT-based authentication\nRole-based access control"
            }
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Each line becomes one bullet point in the Solution & features section.
          </p>
        </div>

        {/* Challenges & Learnings */}
        <div>
          <label className="mb-1 block font-medium">Challenges & learnings</label>
          <textarea
            rows={3}
            className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={form.learnings}
            onChange={(e) =>
              setForm((f) => ({ ...f, learnings: e.target.value }))
            }
            placeholder="Summarize key implementation challenges and what you learned."
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

        <div>
          <label className="mb-1 block font-medium">Image URL</label>
          <input
            className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={form.imageUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, imageUrl: e.target.value }))
            }
            placeholder="https://your-image-host.com/thumbnail.png"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Optional thumbnail or screenshot URL (first image shown on homepage).
          </p>
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

      {loading && <p className="text-sm text-slate-500">Loading projects...</p>}
      {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
      {!loading && !projects.length && !error && (
        <p className="text-sm text-slate-500">No projects found.</p>
      )}

      {!loading && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
            >
              {editingId === project._id ? (
                <form onSubmit={handleUpdate} className="space-y-2 text-xs">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                    <input
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, category: e.target.value }))
                      }
                      placeholder="Web, Mobile, Data, PowerBI, Other"
                    />
                  </div>
                  <textarea
                    rows={2}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />

                  <textarea
                    rows={2}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                    value={editForm.problem}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, problem: e.target.value }))
                    }
                    placeholder="Problem statement"
                  />

                  <textarea
                    rows={2}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                    value={editForm.features}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, features: e.target.value }))
                    }
                    placeholder="One feature per line"
                  />

                  <textarea
                    rows={2}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                    value={editForm.learnings}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, learnings: e.target.value }))
                    }
                    placeholder="Challenges & learnings"
                  />

                  <input
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                    value={editForm.techStack}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, techStack: e.target.value }))
                    }
                  />
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                      value={editForm.demoUrl}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, demoUrl: e.target.value }))
                      }
                    />
                    <input
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                      value={editForm.repoUrl}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, repoUrl: e.target.value }))
                      }
                    />
                  </div>
                  <input
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                    value={editForm.imageUrl}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, imageUrl: e.target.value }))
                    }
                    placeholder="Thumbnail image URL"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded bg-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="rounded bg-emerald-600 px-2 py-1 text-[11px] text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {updating ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between gap-3">
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

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => startEdit(project)}
                      className="rounded bg-sky-600 px-2 py-1 text-[11px] text-white hover:bg-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="rounded bg-red-500 px-2 py-1 text-[11px] text-white hover:bg-red-600"
                    >
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
  );
}

export default AdminProjectsPage;
