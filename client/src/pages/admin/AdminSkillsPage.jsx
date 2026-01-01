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

  return (
    <div>
      <h1 className="mb-3 text-lg font-semibold">Skills</h1>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        Add or edit skills grouped by category (Frontend, Backend, Tools, Data).
      </p>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="grid gap-2 md:grid-cols-3">
          <div>
            <label className="mb-1 block font-medium">Name</label>
            <input
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Category</label>
            <select
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
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
            <label className="mb-1 block font-medium">Proficiency (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.proficiency}
              onChange={(e) =>
                setForm((f) => ({ ...f, proficiency: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add skill"}
          </button>
        </div>
      </form>

      {loading && (
        <p className="text-sm text-slate-500">Loading skills...</p>
      )}

      {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

      {!loading && !skills.length && !error && (
        <p className="text-sm text-slate-500">No skills found.</p>
      )}

      {!loading && skills.length > 0 && (
        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
            >
              {editingId === skill._id ? (
                <form
                  onSubmit={handleUpdate}
                  className="flex flex-1 flex-col gap-2 text-xs md:flex-row md:items-center"
                >
                  <input
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                  <select
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
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
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                    value={editForm.proficiency}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        proficiency: e.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2">
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
                <>
                  <div>
                    <h2 className="text-sm font-semibold">{skill.name}</h2>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Category: {skill.category} · Proficiency:{" "}
                      {skill.proficiency}%
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => startEdit(skill)}
                      className="rounded bg-sky-600 px-2 py-1 text-[11px] text-white hover:bg-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="rounded bg-red-500 px-2 py-1 text-[11px] text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminSkillsPage;
