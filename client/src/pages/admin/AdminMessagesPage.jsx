// client/src/pages/admin/AdminMessagesPage.jsx
import { useEffect, useState } from "react";
import {
  adminGetMessages,
  adminMarkMessageRead,
  adminDeleteMessage,
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          Messages
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          View contact form submissions sent from your portfolio.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Loading messages...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !messages.length && !error && (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-slate-500 dark:text-slate-400">No messages yet.</p>
        </div>
      )}

      {!loading && messages.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              All Messages
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                {messages.filter(m => !m.isRead).length} unread
              </span>
              <span className="text-slate-400">|</span>
              <span>{messages.length} total</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                  msg.isRead 
                    ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                    : "border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-900/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          {msg.name}
                          {!msg.isRead && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                              New
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <a 
                            href={`mailto:${msg.email}`} 
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {msg.email}
                          </a>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mt-2">
                      {msg.message}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        msg.isRead
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {msg.isRead ? "Read" : "Unread"}
                    </span>

                    <div className="flex gap-2">
                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkRead(msg._id)}
                          className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 transition-colors"
                          title="Mark as read"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                          </svg>
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="inline-flex items-center justify-center rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMessagesPage;