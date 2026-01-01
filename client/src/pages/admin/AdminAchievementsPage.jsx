// client/src/pages/admin/AdminAchievementsPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetAchievements,
  adminDeleteAchievement,
  adminCreateAchievement,
  adminUpdateAchievement,
} from "../../lib/adminAchievementsApi";

function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // create form
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    date: "",
    type: "Certificate", // must match enum in backend
    certificateUrl: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    issuer: "",
    date: "",
    type: "Certificate",
    certificateUrl: "",
    description: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadAchievements = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminGetAchievements();
        if (!ignore) setAchievements(data);
      } catch (err) {
        console.error(err);
        if (!ignore) setError("Failed to load achievements.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadAchievements();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this achievement?")) return;
    try {
      await adminDeleteAchievement(id);
      setAchievements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete achievement.");
    }
  };

  async function handleCreate(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.issuer.trim() || !form.date) {
      alert("Title, issuer, and date are required.");
      return;
    }

    const allowedTypes = ["Certificate", "Award", "Competition", "Academic"];
    const type = allowedTypes.includes(form.type) ? form.type : "Certificate";
    const dateIso = new Date(form.date).toISOString();

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        issuer: form.issuer.trim(),
        date: dateIso,
        type,
        certificateUrl: form.certificateUrl.trim() || undefined,
        description: form.description.trim() || undefined,
      };

      const createdRes = await adminCreateAchievement(payload);
      const created = createdRes.data || createdRes;

      setAchievements((prev) => [created, ...prev]);
      setForm({
        title: "",
        issuer: "",
        date: "",
        type: "Certificate",
        certificateUrl: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to create achievement."
      );
    } finally {
      setSaving(false);
    }
  }

  const startEdit = (ach) => {
    setEditingId(ach._id);
    setEditForm({
      title: ach.title || "",
      issuer: ach.issuer || "",
      date: ach.date ? ach.date.slice(0, 10) : "",
      type: ach.type || "Certificate",
      certificateUrl: ach.certificateUrl || "",
      description: ach.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      issuer: "",
      date: "",
      type: "Certificate",
      certificateUrl: "",
      description: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    if (!editForm.title.trim() || !editForm.issuer.trim() || !editForm.date) {
      alert("Title, issuer, and date are required.");
      return;
    }

    const allowedTypes = ["Certificate", "Award", "Competition", "Academic"];
    const type = allowedTypes.includes(editForm.type)
      ? editForm.type
      : "Certificate";
    const dateIso = new Date(editForm.date).toISOString();

    setUpdating(true);
    try {
      const payload = {
        title: editForm.title.trim(),
        issuer: editForm.issuer.trim(),
        date: dateIso,
        type,
        certificateUrl: editForm.certificateUrl.trim() || undefined,
        description: editForm.description.trim() || undefined,
      };

      const updatedRes = await adminUpdateAchievement(editingId, payload);
      const updated = updatedRes.data || updatedRes;

      setAchievements((prev) =>
        prev.map((a) => (a._id === editingId ? updated : a))
      );
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to update achievement."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Achievements</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Manage your achievements shown on the public portfolio.
      </p>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Issuer</label>
            <input
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.issuer}
              onChange={(e) =>
                setForm((f) => ({ ...f, issuer: e.target.value }))
              }
              placeholder="SLIIT, Google, Hackathon name..."
            />
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.date}
              onChange={(e) =>
                setForm((f) => ({ ...f, date: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value }))
              }
            >
              <option>Certificate</option>
              <option>Award</option>
              <option>Competition</option>
              <option>Academic</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Certificate URL</label>
            <input
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={form.certificateUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, certificateUrl: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            rows={3}
            className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Short summary of what you achieved."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add achievement"}
          </button>
        </div>
      </form>

      {loading && (
        <p className="text-sm text-slate-500">Loading achievements...</p>
      )}
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      {!loading && !achievements.length && !error && (
        <p className="text-sm text-slate-500">No achievements found.</p>
      )}

      {!loading && achievements.length > 0 && (
        <div className="space-y-3">
          {achievements.map((ach) => (
            <div
              key={ach._id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-3"
            >
              {editingId === ach._id ? (
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
                      value={editForm.issuer}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, issuer: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    <input
                      type="date"
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                      value={editForm.date}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, date: e.target.value }))
                      }
                    />
                    <select
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, type: e.target.value }))
                      }
                    >
                      <option>Certificate</option>
                      <option>Award</option>
                      <option>Competition</option>
                      <option>Academic</option>
                    </select>
                    <input
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                      value={editForm.certificateUrl}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          certificateUrl: e.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <textarea
                    rows={2}
                    className="w-full rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
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
                    <h2 className="text-sm font-semibold">{ach.title}</h2>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {ach.issuer} ·{" "}
                      {ach.date
                        ? new Date(ach.date).toLocaleDateString()
                        : "No date"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Type: {ach.type}
                    </p>
                    {ach.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {ach.description}
                      </p>
                    )}
                    {ach.certificateUrl && (
                      <a
                        href={ach.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-[11px] text-sky-600 hover:underline"
                      >
                        View certificate
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => startEdit(ach)}
                      className="text-[11px] px-2 py-1 rounded bg-sky-600 text-white hover:bg-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ach._id)}
                      className="text-[11px] px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
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

export default AdminAchievementsPage;
