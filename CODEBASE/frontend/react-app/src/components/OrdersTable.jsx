// ─── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  placed: "bg-blue-100 text-blue-700 border border-blue-200",
  shipped: "bg-purple-100 text-purple-700 border border-purple-200",
  delivered: "bg-green-100 text-green-700 border border-green-200",
  cancelled: "bg-red-100 text-red-700 border border-red-200",
};

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
    {status}
  </span>
);

// ─── Main Table ────────────────────────────────────────────────────────────────
export default function OrdersTable({
  orders,
  loading,
  error,
  onAccept,
  onReject,
  onUpdateStatus,
  onRetry,
}) {
  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#355872] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-[#355872] text-white text-sm font-semibold hover:bg-[#2a4760] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Empty State ──
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2">
        <p className="text-gray-400 text-lg font-semibold">No orders found</p>
        <p className="text-gray-400 text-sm">Orders will appear here once customers place them</p>
      </div>
    );
  }

  // ── Table ──
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f4f7fa] text-[#355872] text-xs font-bold uppercase tracking-wide">
              <th className="px-5 py-3.5 text-left">Order ID</th>
              <th className="px-5 py-3.5 text-left">User ID</th>
              <th className="px-5 py-3.5 text-left">Items</th>
              <th className="px-5 py-3.5 text-left">Total Amount</th>
              <th className="px-5 py-3.5 text-left">Status</th>
              <th className="px-5 py-3.5 text-left">Date</th>
              <th className="px-5 py-3.5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#f9fbfc] transition-colors">

                {/* Order ID */}
                <td className="px-5 py-4 font-semibold text-[#355872]">
                  #{order.id}
                </td>

                {/* User ID */}
                <td className="px-5 py-4 text-gray-600">
                  User #{order.user_id}
                </td>

                {/* Items count */}
                <td className="px-5 py-4 text-gray-600">
                  {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
                </td>

                {/* Total Amount */}
                <td className="px-5 py-4 font-semibold text-gray-800">
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 flex-wrap">

                    {/* Accept / Reject — only for pending */}
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => onAccept(order)}
                          className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onReject(order)}
                          className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {/* Update Status — for placed and shipped */}
                    {["placed", "shipped"].includes(order.status) && (
                      <button
                        onClick={() => onUpdateStatus(order)}
                        className="px-3 py-1.5 rounded-lg bg-[#355872] text-white text-xs font-semibold hover:bg-[#2a4760] transition-all"
                      >
                        Update Status
                      </button>
                    )}

                    {/* Delivered / Cancelled — terminal, no actions */}
                    {["delivered", "cancelled"].includes(order.status) && (
                      <span className="text-xs text-gray-400 italic">No actions</span>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}