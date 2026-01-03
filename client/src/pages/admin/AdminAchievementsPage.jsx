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

  const getTypeColor = (type) => {
    switch (type) {
      case "Certificate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Award":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Competition":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Academic":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Achievements
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Manage your achievements shown on the public portfolio.
        </p>
      </div>

      {/* Create form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Achievement
        </h2>
        
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Issuer</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={form.issuer}
                onChange={(e) =>
                  setForm((f) => ({ ...f, issuer: e.target.value }))
                }
                placeholder="SLIIT, Google, Hackathon name..."
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Certificate URL</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={form.certificateUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, certificateUrl: e.target.value }))
                }
                placeholder="https://..."
              />
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
              placeholder="Short summary of what you achieved."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving..." : "Add achievement"}
            </button>
          </div>
        </form>
      </div>

      {/* Achievements list */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Existing Achievements</h2>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Loading achievements...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {!loading && !achievements.length && !error && (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <p className="text-sm text-slate-500 dark:text-slate-400">No achievements found.</p>
          </div>
        )}

        {!loading && achievements.length > 0 && (
          <div className="space-y-4">
            {achievements.map((ach) => (
              <div
                key={ach._id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 transition-shadow hover:shadow-md"
              >
                {editingId === ach._id ? (
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
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Issuer</label>
                        <input
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          value={editForm.issuer}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, issuer: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          value={editForm.date}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, date: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                        <select
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Certificate URL</label>
                        <input
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                      <textarea
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
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
                          {ach.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(ach.type)}`}>
                          {ach.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {ach.issuer}
                        </div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {ach.date ? new Date(ach.date).toLocaleDateString() : "No date"}
                        </div>
                      </div>
                      {ach.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
                          {ach.description}
                        </p>
                      )}
                      {ach.certificateUrl && (
                        <a
                          href={ach.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View certificate
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => startEdit(ach)}
                        className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ach._id)}
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

export default AdminAchievementsPage;