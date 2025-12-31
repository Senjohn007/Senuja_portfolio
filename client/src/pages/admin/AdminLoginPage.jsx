// src/pages/admin/AdminLoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // TODO: call POST /api/admin/login with fetch/axios
      // const res = await axios.post("/api/admin/login", { email, password });
      // localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard/projects");
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h1 className="text-lg font-semibold mb-1">Admin login</h1>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
          Enter your admin credentials to manage projects, skills, and messages.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-[11px] text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-sky-600 px-4 py-2 text-xs font-medium text-white hover:bg-sky-700 transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
