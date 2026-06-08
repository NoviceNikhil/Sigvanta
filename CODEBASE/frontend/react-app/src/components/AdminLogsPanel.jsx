import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminLogs } from "../services/logService";

const TABS = [
  { key: "order", label: "Order Logs" },
  { key: "activity", label: "Activity Logs" },
  { key: "auth", label: "Auth Logs" },
];

function formatTimestamp(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function safeStringify(value) {
  try {
    if (value === undefined || value === null) return "—";
    if (typeof value === "string") return value;
    return JSON.stringify(value);
  } catch {
    return "—";
  }
}

export default function AdminLogsPanel({ title = "Logs", defaultTab = "order", limit = 20 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = useMemo(() => {
    if (activeTab === "order") {
      return [
        { key: "order_id", label: "Order ID" },
        { key: "status", label: "Status" },
        { key: "message", label: "Message" },
        { key: "timestamp", label: "Timestamp" },
      ];
    }

    if (activeTab === "activity") {
      return [
        { key: "user_id", label: "User ID" },
        { key: "action", label: "Action" },
        { key: "module", label: "Module" },
        { key: "metadata", label: "Metadata" },
        { key: "timestamp", label: "Timestamp" },
      ];
    }

    return [
      { key: "user_id", label: "User ID" },
      { key: "provider", label: "Provider" },
      { key: "status", label: "Status" },
      { key: "timestamp", label: "Timestamp" },
    ];
  }, [activeTab]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminLogs(activeTab, { limit });
      setRows(data?.results ?? []);
    } catch (err) {
      setError(err.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mt-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#355872]">{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {loading ? "Loading..." : `${rows.length} latest records`}
          </p>
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-[#355872] text-white text-xs font-semibold hover:bg-[#2a4760] disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mt-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all
              ${activeTab === t.key
                ? "bg-[#355872] text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-200 hover:border-[#355872] hover:text-[#355872]"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              {columns.map((c) => (
                <th key={c.key} className="py-2 pr-4 font-semibold whitespace-nowrap">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 ? (
              <tr>
                <td className="py-4 text-gray-500" colSpan={columns.length}>
                  No logs found.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r._id ?? `${r.timestamp}-${Math.random()}`} className="border-b border-gray-50">
                  {columns.map((c) => {
                    let value = r?.[c.key];
                    if (c.key === "timestamp") value = formatTimestamp(value);
                    if (c.key === "metadata") value = safeStringify(value);
                    if (value === undefined || value === null || value === "") value = "—";
                    return (
                      <td key={c.key} className="py-2 pr-4 text-gray-700 whitespace-nowrap">
                        {String(value).length > 120 ? `${String(value).slice(0, 120)}…` : String(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
