// client/src/lib/adminProjectsApi.js
import { getAdminClient } from "./adminApi";

export async function adminGetProjects() {
  const client = getAdminClient();
  const res = await client.get("/api/admin/projects");
  return res.data;
}

export async function adminCreateProject(payload) {
  const client = getAdminClient();
  const res = await client.post("/api/admin/projects", payload);
  return res.data;
}

export async function adminUpdateProject(id, payload) {
  const client = getAdminClient();
  const res = await client.put(`/api/admin/projects/${id}`, payload);
  return res.data;
}

export async function adminDeleteProject(id) {
  const client = getAdminClient();
  const res = await client.delete(`/api/admin/projects/${id}`);
  return res.data;
}
