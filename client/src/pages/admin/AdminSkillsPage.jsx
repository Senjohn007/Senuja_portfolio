// client/src/pages/admin/AdminSkillsPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetSkills,
  adminDeleteSkill,
} from "../../lib/adminSkillsApi";

function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Skills</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Add or edit skills grouped by category (Frontend, Backend, Tools, Data).
      </p>

      {loading && (
        <p className="text-sm text-slate-500">Loading skills...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}

      {!loading && !skills.length && !error && (
        <p className="text-sm text-slate-500">No skills found.</p>
      )}

      {!loading && skills.length > 0 && (
        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-center justify-between gap-3"
            >
              <div>
                <h2 className="text-sm font-semibold">{skill.name}</h2>
                <p className="text-[11px] text-slate-500 mt-1">
                  Category: {skill.category} · Proficiency: {skill.proficiency}%
                </p>
              </div>

              <button
                onClick={() => handleDelete(skill._id)}
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

export default AdminSkillsPage;
