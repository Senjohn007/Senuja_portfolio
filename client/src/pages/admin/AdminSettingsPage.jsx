// client/src/pages/admin/AdminSettingsPage.jsx
import { useState, useEffect } from "react";

function AdminSettingsPage() {
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setApiBaseUrl(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000");
    // optional: if you store admin email somewhere, prefill; for now leave blank
  }, []);

  function handleSave(e) {
    e.preventDefault();
    // For now just log; later you can POST to /api/admin/settings
    console.log("Settings saved (local only):", {
      apiBaseUrl,
      email,
    });
    alert("Settings saved (demo only – hook to backend later).");
  }

  return (
    <div>
      <h1 className="mb-3 text-lg font-semibold">Settings</h1>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        Basic admin settings. Later you can connect this to backend endpoints.
      </p>

      <form
        onSubmit={handleSave}
        className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 text-xs dark:border-slate-700 dark:bg-slate-900"
      >
        <div>
          <label className="mb-1 block font-medium">API base URL</label>
          <input
            className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Currently read from VITE_API_BASE_URL at build time.
          </p>
        </div>

        <div>
          <label className="mb-1 block font-medium">Admin contact email</label>
          <input
            type="email"
            className="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            For now this is only stored in memory; later you can persist it in DB.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="rounded bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700"
          >
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminSettingsPage;
