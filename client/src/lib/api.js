// client/src/lib/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function getSkills() {
  const res = await axios.get(`${API_BASE_URL}/api/skills`);
  return res.data;
}

export async function getProjects() {
  const res = await axios.get(`${API_BASE_URL}/api/projects`);
  return res.data;
}

export async function getAchievements() {
  const res = await axios.get(`${API_BASE_URL}/api/achievements`);
  return res.data;
}

export async function postMessage(payload) {
  const res = await axios.post(`${API_BASE_URL}/api/messages`, payload);
  return res.data;
}

export async function getProject(id) {
  const res = await axios.get(`${API_BASE_URL}/api/projects/${id}`);
  return res.data;
}

