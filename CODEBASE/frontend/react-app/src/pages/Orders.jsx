
import { useState, useEffect, useCallback } from "react";
import { getMyOrders, cancelMyOrder } from "../services/orderService";

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

// ─── Cancel Confirmation Modal ─────────────────────────────────────────────────
const CancelModal = ({ order, loading, error, onConfirm, onClose }) => {
    if (!order) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#355872]">Cancel Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to cancel{" "}
                    <span className="font-semibold text-gray-700">Order #{order.id}</span>?
                    This action cannot be undone.
                </p>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        Keep Order
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all disabled:opacity-50"
                    >
                        {loading ? "Cancelling..." : "Yes, Cancel"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Order Card ────────────────────────────────────────────────────────────────
const OrderCard = ({ order, onCancel }) => {
    const canCancel = order.status === "pending";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">

            {/* ── Order Header Row ── */}
            <div className="px-5 py-4 flex flex-wrap items-center gap-4">

                {/* Order ID + Date */}
                <div className="flex-1 min-w-[120px]">
                    <p className="text-sm font-bold text-[#355872]">Order #{order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                        })}
                    </p>
                </div>

                {/* Total Amount */}
                <div className="text-right sm:text-left">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-sm font-bold text-gray-800">
                        ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </p>
                </div>

                {/* Items Count */}
                <div className="text-right sm:text-left">
                    <p className="text-xs text-gray-400">Items</p>
                    <p className="text-sm font-semibold text-gray-700">
                        {order.items?.length ?? 0}
                    </p>
                </div>

                {/* Status */}
                <StatusBadge status={order.status} />

                {/* Cancel — only for pending */}
                {canCancel && (
                    <button
                        onClick={() => onCancel(order)}
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {/* ── Progress Tracker ── */}
            {!["delivered", "cancelled"].includes(order.status) && (
                <div className="px-5 pb-3">
                    <OrderProgressBar status={order.status} />
                </div>
            )}

            {/* ── Items Section — always visible ── */}
            <div className="border-t border-gray-50 bg-[#f9fbfc] px-5 py-4">
                {order.items && order.items.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Order Items</p>
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    {item.product?.image ? (
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">
                                            {item.product?.name ?? `Product #${item.product_id}`}
                                        </p>
                                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-[#355872]">
                                    ₹{Number(item.price).toLocaleString("en-IN")}
                                </p>
                            </div>
                        ))}

                        {/* Order Total */}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-1">
                            <p className="text-xs font-semibold text-gray-500">Order Total</p>
                            <p className="text-sm font-bold text-[#355872]">
                                ₹{Number(order.total_amount).toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No items found for this order.</p>
                )}
            </div>
        </div>
    );
};

// ─── Order Progress Bar ────────────────────────────────────────────────────────
const STEPS = ["pending", "placed", "shipped", "delivered"];

const OrderProgressBar = ({ status }) => {
    const currentIndex = STEPS.indexOf(status);
    return (
        <div className="flex items-center gap-0 w-full mt-1">
            {STEPS.map((step, i) => {
                const done = i <= currentIndex;
                const isLast = i === STEPS.length - 1;
                return (
                    <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${done ? "bg-[#355872] text-white" : "bg-gray-200 text-gray-400"}`}
                            >
                                {done ? (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : i + 1}
                            </div>
                            <p className={`text-xs mt-1 capitalize font-medium ${done ? "text-[#355872]" : "text-gray-400"}`}>
                                {step}
                            </p>
                        </div>
                        {!isLast && (
                            <div className={`flex-1 h-0.5 mb-4 mx-1 rounded transition-all
                ${i < currentIndex ? "bg-[#355872]" : "bg-gray-200"}`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cancel modal state
    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelError, setCancelError] = useState(null);

    // Status filter
    const [activeFilter, setActiveFilter] = useState("all");

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMyOrders();
            console.log(data);

            setOrders(data ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    // ── Cancel flow ──
    const handleCancelClick = (order) => {
        setCancelTarget(order);
        setCancelError(null);
    };

    const handleCancelConfirm = async () => {
        setCancelLoading(true);
        setCancelError(null);
        try {
            await cancelMyOrder(cancelTarget.id);
            setCancelTarget(null);
            fetchOrders(); // refresh list
        } catch (err) {
            setCancelError(err.message);
        } finally {
            setCancelLoading(false);
        }
    };

    // ── Filter ──
    const STATUS_FILTERS = ["all", "pending", "placed", "shipped", "delivered", "cancelled"];

    const filteredOrders =
        activeFilter === "all"
            ? orders
            : orders.filter((o) => o.status === activeFilter);

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#355872] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f7fa] font-sans">

            {/* ── Top Bar ── */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30 shadow-sm">
                <h1 className="text-xl font-bold text-[#355872]">My Orders</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    {orders.length} order{orders.length !== 1 ? "s" : ""} placed
                </p>
            </div>

            <div className="px-4 sm:px-6 py-5 max-w-4xl mx-auto">

                {/* ── Error ── */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                        <p className="text-sm text-red-600">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="text-xs font-semibold text-red-600 underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ── Status Filter Pills ── */}
                <div className="flex gap-2 flex-wrap mb-5">
                    {STATUS_FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all
                ${activeFilter === f
                                    ? "bg-[#355872] text-white shadow-sm"
                                    : "bg-white text-gray-500 border border-gray-200 hover:border-[#355872] hover:text-[#355872]"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* ── Orders List ── */}
                {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <svg className="w-14 h-14 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-400 font-semibold text-lg">No orders found</p>
                        <p className="text-gray-400 text-sm">
                            {activeFilter === "all"
                                ? "You haven't placed any orders yet."
                                : `No ${activeFilter} orders found.`}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onCancel={handleCancelClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Cancel Confirmation Modal ── */}
            <CancelModal
                order={cancelTarget}
                loading={cancelLoading}
                error={cancelError}
                onConfirm={handleCancelConfirm}
                onClose={() => { setCancelTarget(null); setCancelError(null); }}
            />
        </div>
    );
}