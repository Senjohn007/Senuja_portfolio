// client/src/pages/admin/AdminSkillsPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetSkills,
  adminDeleteSkill,
  adminCreateSkill,
  adminUpdateSkill,
} from "../../lib/adminSkillsApi";

function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // create form state
  const [form, setForm] = useState({
    name: "",
    category: "Frontend",
    proficiency: 80,
  });
  const [saving, setSaving] = useState(false);

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "Frontend",
    proficiency: 80,
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadSkills = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminGetSkills();
        if (!ignore) setSkills(data);
      } catch (err) {
        console.error(err);
        if (!ignore) setError("Failed to load skills.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadSkills();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await adminDeleteSkill(id);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete skill.");
    }
  };

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        proficiency: Number(form.proficiency) || 0,
      };
      const createdRes = await adminCreateSkill(payload);
      const created = createdRes.data || createdRes;
      setSkills((prev) => [created, ...prev]);
      setForm({ name: "", category: "Frontend", proficiency: 80 });
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to create skill."
      );
    } finally {
      setSaving(false);
    }
  }

  // enter edit mode
  const startEdit = (skill) => {
    setEditingId(skill._id);
    setEditForm({
      name: skill.name || "",
      category: skill.category || "Frontend",
      proficiency: skill.proficiency ?? 80,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      category: "Frontend",
      proficiency: 80,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    if (!editForm.name.trim()) {
      alert("Name is required.");
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        name: editForm.name.trim(),
        category: editForm.category,
        proficiency: Number(editForm.proficiency) || 0,
      };

      const updatedRes = await adminUpdateSkill(editingId, payload);
      const updated = updatedRes.data || updatedRes;

      setSkills((prev) =>
        prev.map((s) => (s._id === editingId ? updated : s))
      );
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to update skill."
      );
    } finally {
      setUpdating(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Frontend":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Backend":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Tools":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Data":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const getProficiencyColor = (proficiency) => {
    if (proficiency >= 80) return "bg-emerald-500";
    if (proficiency >= 60) return "bg-sky-500";
    if (proficiency >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Skills
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Add or edit skills grouped by category (Frontend, Backend, Tools, Data).
        </p>
      </div>

      {/* Create form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Skill
        </h2>
        
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
                <option>Frontend</option>
                <option>Backend</option>
                <option>Tools</option>
                <option>Data</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Proficiency (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="flex-1"
                  value={form.proficiency}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, proficiency: e.target.value }))
                  }
                />
                <span className="w-12 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                  {form.proficiency}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving..." : "Add skill"}
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Loading skills...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !skills.length && !error && (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-sm text-slate-500 dark:text-slate-400">No skills found.</p>
        </div>
      )}

      {!loading && skills.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Skills by Category</h2>
          
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-base font-medium text-slate-900 dark:text-white mb-3 flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${getCategoryColor(category)}`}>
                  {category}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                </span>
              </h3>
              
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 transition-shadow hover:shadow-md"
                  >
                    {editingId === skill._id ? (
                      <form onSubmit={handleUpdate} className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                          <input
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, name: e.target.value }))
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
                            <option>Frontend</option>
                            <option>Backend</option>
                            <option>Tools</option>
                            <option>Data</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Proficiency</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              className="flex-1"
                              value={editForm.proficiency}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  proficiency: e.target.value,
                                }))
                              }
                            />
                            <span className="w-12 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                              {editForm.proficiency}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={updating}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                          >
                            {updating ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                            {skill.name}
                          </h4>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => startEdit(skill)}
                              className="inline-flex items-center justify-center rounded-lg bg-sky-600 p-1.5 text-white hover:bg-sky-700 transition-colors"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(skill._id)}
                              className="inline-flex items-center justify-center rounded-lg bg-red-500 p-1.5 text-white hover:bg-red-600 transition-colors"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Proficiency</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProficiencyColor(skill.proficiency)}`}
                              style={{ width: `${skill.proficiency}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminSkillsPage;