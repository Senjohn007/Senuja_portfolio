// client/src/pages/admin/AdminAchievementsPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetAchievements,
  adminDeleteAchievement,
  adminCreateAchievement,
} from "../../lib/adminAchievementsApi";

function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    issuer: "",
    date: "",
    type: "Certificate", // must match enum
    certificateUrl: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

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

    // Ensure type matches the allowed enum
    const allowedTypes = ["Certificate", "Award", "Competition", "Academic"];
    const type = allowedTypes.includes(form.type) ? form.type : "Certificate";

    // Convert date string (yyyy-mm-dd) into ISO Date string
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

      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}

      {!loading && !achievements.length && !error && (
        <p className="text-sm text-slate-500">No achievements found.</p>
      )}

      {!loading && achievements.length > 0 && (
        <div className="space-y-3">
          {achievements.map((ach) => (
            <div
              key={ach._id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-start justify-between gap-3"
            >
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

              <button
                onClick={() => handleDelete(ach._id)}
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

export default AdminAchievementsPage;
