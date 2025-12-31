// client/src/lib/adminAchievementsApi.js
import { getAdminClient } from "./adminApi";

export async function adminGetAchievements() {
  const client = getAdminClient();
  const res = await client.get("/api/admin/achievements");
  return res.data;
}

export async function adminCreateAchievement(payload) {
  const client = getAdminClient();
  const res = await client.post("/api/admin/achievements", payload);
  return res.data;
}

export async function adminUpdateAchievement(id, payload) {
  const client = getAdminClient();
  const res = await client.put(`/api/admin/achievements/${id}`, payload);
  return res.data;
}

export async function adminDeleteAchievement(id) {
  const client = getAdminClient();
  const res = await client.delete(`/api/admin/achievements/${id}`);
  return res.data;
}
