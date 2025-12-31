// client/src/pages/admin/AdminAchievementsPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetAchievements,
  adminDeleteAchievement,
} from "../../lib/adminAchievementsApi";

function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Achievements</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Manage your achievements shown on the public portfolio.
      </p>

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
                <h2 className="text-sm font-semibold">
                  {ach.title}
                </h2>
                <p className="text-[11px] text-slate-500 mt-1">
                  {ach.issuer} ·{" "}
                  {ach.date ? new Date(ach.date).toLocaleDateString() : "No date"}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Type: {ach.type}
                </p>
                {ach.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    {ach.description}
                  </p>
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
