// client/src/pages/admin/AdminMessagesPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetMessages,
  adminMarkMessageRead,
  adminDeleteMessage,   // 👈 new
} from "../../lib/adminMessagesApi";

function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadMessages = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminGetMessages();
        if (!ignore) setMessages(data);
      } catch (err) {
        console.error(err);
        if (!ignore) setError("Failed to load messages.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadMessages();
    return () => {
      ignore = true;
    };
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await adminMarkMessageRead(id);
      const updated = res.data || res;
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: updated.isRead ?? true } : m))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to mark message as read.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await adminDeleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete message.");
    }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Messages</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        View contact form submissions sent from your portfolio.
      </p>

      {loading && (
        <p className="text-sm text-slate-500">Loading messages...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}

      {!loading && !messages.length && !error && (
        <p className="text-sm text-slate-500">No messages yet.</p>
      )}

      {!loading && messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-start justify-between gap-3"
            >
              <div>
                <h2 className="text-sm font-semibold">
                  {msg.name}{" "}
                  <span className="text-[11px] text-slate-500">
                    &lt;{msg.email}&gt;
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-1">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleString()
                    : ""}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-200 mt-2 whitespace-pre-line">
                  {msg.message}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={
                    "text-[11px] px-2 py-0.5 rounded-full " +
                    (msg.isRead
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700")
                  }
                >
                  {msg.isRead ? "Read" : "Unread"}
                </span>

                <div className="flex gap-2">
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkRead(msg._id)}
                      className="text-[11px] px-2 py-1 rounded bg-sky-600 text-white hover:bg-sky-700"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-[11px] px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminMessagesPage;
