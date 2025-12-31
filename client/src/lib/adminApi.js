// client/src/lib/adminApi.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Create axios instance with Authorization header from localStorage
export function getAdminClient() {
  const token = localStorage.getItem("portfolio_admin_token");

  return axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// Login helper – used only on AdminLoginPage
export async function adminLogin({ email, password }) {
  const res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
    email,
    password,
  });
  return res.data; // expect { token: "..." }
}

// Optional: generic helpers you can reuse later
export async function adminGet(path) {
  const client = getAdminClient();
  const res = await client.get(path);
  return res.data;
}

export async function adminPost(path, payload) {
  const client = getAdminClient();
  const res = await client.post(path, payload);
  return res.data;
}

export async function adminPut(path, payload) {
  const client = getAdminClient();
  const res = await client.put(path, payload);
  return res.data;
}

export async function adminDelete(path) {
  const client = getAdminClient();
  const res = await client.delete(path);
  return res.data;
}
