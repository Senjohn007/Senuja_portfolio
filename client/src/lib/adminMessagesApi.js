// client/src/lib/adminMessagesApi.js
import { getAdminClient } from "./adminApi";

// GET /api/admin/messages
export async function adminGetMessages() {
  const client = getAdminClient();
  const res = await client.get("/api/admin/messages");
  return res.data;
}

// PUT /api/admin/messages/:id (mark as read)
export async function adminMarkMessageRead(id) {
  const client = getAdminClient();
  const res = await client.put(`/api/admin/messages/${id}`);
  return res.data;
}
