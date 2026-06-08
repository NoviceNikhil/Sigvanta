// ─── Next status options based on current status ───────────────────────────────
const NEXT_STATUS_OPTIONS = {
  placed:  ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
};

// ─── Modal ─────────────────────────────────────────────────────────────────────
export default function OrderStatusModal({
  mode,       // "accept" | "reject" | "status" | null
  order,
  loading,
  error,
  onAccept,
  onReject,
  onUpdateStatus,
  onClose,
}) {
  if (!mode || !order) return null;

  // ── Config per mode ──
  const config = {
    accept: {
      title: "Accept Order",
      description: `Are you sure you want to accept Order #${order.id}? The status will change from pending to placed.`,
      confirmLabel: "Accept Order",
      confirmClass: "bg-green-600 hover:bg-green-700 text-white",
      onConfirm: onAccept,
    },
    reject: {
      title: "Reject Order",
      description: `Are you sure you want to reject Order #${order.id}? The status will change to cancelled.`,
      confirmLabel: "Reject Order",
      confirmClass: "bg-red-600 hover:bg-red-700 text-white",
      onConfirm: onReject,
    },
  };

  // ── Status Update Modal (has a dropdown) ──
  if (mode === "status") {
    const options = NEXT_STATUS_OPTIONS[order.status] ?? [];

    return (
      <Overlay onClose={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <ModalHeader title="Update Order Status" onClose={onClose} />

          <p className="text-sm text-gray-500 mb-1">
            Order <span className="font-semibold text-[#355872]">#{order.id}</span>
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Current status:{" "}
            <span className="font-semibold capitalize text-gray-700">{order.status}</span>
          </p>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select new status
          </label>
          <div className="flex flex-col gap-2 mb-5">
            {options.map((s) => (
              <button
                key={s}
                onClick={() => onUpdateStatus(s)}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold capitalize text-gray-700 hover:bg-[#355872] hover:text-white hover:border-[#355872] transition-all disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        </div>
      </Overlay>
    );
  }

  // ── Confirm Modal (accept / reject / delete) ──
  const { title, description, confirmLabel, confirmClass, onConfirm } = config[mode];

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <ModalHeader title={title} onClose={onClose} />

        <p className="text-sm text-gray-500 mb-6">{description}</p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${confirmClass}`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const Overlay = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    onClick={onClose}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const ModalHeader = ({ title, onClose }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-bold text-[#355872]">{title}</h2>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);