// client/src/pages/admin/AdminSkillsPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetSkills,
  adminDeleteSkill,
  adminCreateSkill,
} from "../../lib/adminSkillsApi";

function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Frontend",
    proficiency: 80,
  });
  const [saving, setSaving] = useState(false);

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
      const created = await adminCreateSkill(payload);
      setSkills((prev) => [created, ...prev]);
      setForm({ name: "", category: "Frontend", proficiency: 80 });
    } catch (err) {
      console.error(err);
      alert("Failed to create skill.");
    } finally {
      setSaving(false);
    }
  }

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

      {error && (
        <p className="mb-2 text-sm text-red-500">{error}</p>
      )}

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
              <div>
                <h2 className="text-sm font-semibold">{skill.name}</h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Category: {skill.category} · Proficiency: {skill.proficiency}%
                </p>
              </div>

              <button
                onClick={() => handleDelete(skill._id)}
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

export default AdminSkillsPage;
