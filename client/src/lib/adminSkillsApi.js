// client/src/lib/adminSkillsApi.js
import { getAdminClient } from "./adminApi";

export async function adminGetSkills() {
  const client = getAdminClient();
  const res = await client.get("/api/admin/skills");
  return res.data;
}

export async function adminCreateSkill(payload) {
  const client = getAdminClient();
  const res = await client.post("/api/admin/skills", payload);
  return res.data;
}

export async function adminUpdateSkill(id, payload) {
  const client = getAdminClient();
  const res = await client.put(`/api/admin/skills/${id}`, payload);
  return res.data;
}

export async function adminDeleteSkill(id) {
  const client = getAdminClient();
  const res = await client.delete(`/api/admin/skills/${id}`);
  return res.data;
}
