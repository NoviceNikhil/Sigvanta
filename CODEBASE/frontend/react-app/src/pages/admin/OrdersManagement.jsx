import { useState, useEffect, useCallback } from "react";
import {
    getAllOrders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
} from "../../services/orderService";
import OrdersTable from "../../components/OrdersTable";
import OrderStatusModal from "../../components/OrderStatusModal";

const STATUS_TABS = ["all", "pending", "placed", "shipped", "delivered", "cancelled"];
const PAGE_SIZE = 10;

export default function OrdersManagement() {
    // ── Data ──
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── Filters ──
    const [activeTab, setActiveTab] = useState("all");
    const [searchUserId, setSearchUserId] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // ── Pagination ──
    const [currentPage, setCurrentPage] = useState(1);

    // ── Modal ──
    const [modalMode, setModalMode] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);

    // ── Fetch all orders ──
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllOrders();
            console.log("orders data -->", data);

            setOrders(data ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    // ── Reset to page 1 whenever any filter changes ──
    useEffect(() => { setCurrentPage(1); }, [activeTab, searchUserId, minAmount, maxAmount, fromDate, toDate]);

    // ── Apply all filters on ALL orders (not just current page) ──
    console.log("orders are ---> ", orders)
    const filteredOrders = orders.filter((o) => {
        if (activeTab !== "all" && o.status !== activeTab) return false;

        // Search by user ID — partial match
        if (searchUserId.trim() !== "" && !String(o.user_id).includes(searchUserId.trim())) return false;

        // Amount range
        const amount = Number(o.total_amount);
        if (minAmount !== "" && amount < Number(minAmount)) return false;
        if (maxAmount !== "" && amount > Number(maxAmount)) return false;

        // Date range
        const orderDate = new Date(o.createdAt);
        if (fromDate && orderDate < new Date(fromDate)) return false;
        if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            if (orderDate > to) return false;
        }

        return true;
    });

    // ── Pagination calculations (on filteredOrders, not raw orders) ──
    const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    // ── Count per status tab (always on raw orders — unaffected by filters) ──
    const countByStatus = (status) =>
        status === "all"
            ? orders.length
            : orders.filter((o) => o.status === status).length;

    const hasActiveFilters = searchUserId || minAmount || maxAmount || fromDate || toDate;

    const clearFilters = () => {
        setSearchUserId("");
        setMinAmount("");
        setMaxAmount("");
        setFromDate("");
        setToDate("");
        setActiveTab("all");
    };

    // ── Modal helpers ──
    const openModal = (mode, order) => { setModalMode(mode); setSelectedOrder(order); setActionError(null); };
    const closeModal = () => { setModalMode(null); setSelectedOrder(null); setActionError(null); };

    // ── Generic action runner ──
    const runAction = async (fn) => {
        setActionLoading(true);
        setActionError(null);
        try {
            await fn();
            closeModal();
            fetchOrders();
        } catch (err) {
            setActionError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAccept = () => runAction(() => acceptOrder(selectedOrder.id));
    const handleReject = () => runAction(() => rejectOrder(selectedOrder.id));
    const handleUpdateStatus = (newStatus) =>
        runAction(() => updateOrderStatus(selectedOrder.id, newStatus));

    return (
        <div className="min-h-screen bg-[#f4f7fa] font-sans">

            {/* ── Top Bar ── */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-[#355872]">Orders Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {loading ? "Loading..." : `${filteredOrders.length} of ${orders.length} orders`}
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#355872] text-white text-sm font-semibold hover:bg-[#2a4760] active:scale-95 transition-all shadow-md shadow-[#355872]/20 disabled:opacity-50"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            <div className="px-6 py-5 max-w-screen-2xl mx-auto">

                {/* ── Summary Cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                    {STATUS_TABS.map((status) => (
                        <div
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`bg-white rounded-xl px-4 py-3 border cursor-pointer transition-all hover:shadow-md
                ${activeTab === status
                                    ? "border-[#355872] shadow-md ring-1 ring-[#355872]/20"
                                    : "border-gray-100"
                                }`}
                        >
                            <p className="text-xs font-semibold text-gray-400 capitalize mb-1">{status}</p>
                            <p className="text-2xl font-bold text-[#355872]">{countByStatus(status)}</p>
                        </div>
                    ))}
                </div>

                {/* ── Search + Filters Row ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-4">
                    <div className="flex flex-wrap gap-4 items-end">

                        {/* Search by User ID */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500">Search by User ID</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="number"
                                    placeholder="e.g. 7"
                                    value={searchUserId}
                                    onChange={(e) => setSearchUserId(e.target.value)}
                                    className="w-88 pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#355872] transition-all"
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-px bg-gray-200 self-end mb-0.5 hidden sm:block" />

                        {/* Amount Range */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500">Min Amount (₹)</label>
                            <input
                                type="number"
                                placeholder="e.g. 500"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                                className="w-36 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#355872] transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500">Max Amount (₹)</label>
                            <input
                                type="number"
                                placeholder="e.g. 10000"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                                className="w-36 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#355872] transition-all"
                            />
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-px bg-gray-200 self-end mb-0.5 hidden sm:block" />

                        {/* Date Range */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500">From Date</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-40 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#355872] transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500">To Date</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-40 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#355872] transition-all"
                            />
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="self-end px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Filter summary */}
                    {hasActiveFilters && (
                        <p className="text-xs text-gray-400 mt-3">
                            Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} matching current filters
                        </p>
                    )}
                </div>

                {/* ── Status Filter Tabs ── */}
                <div className="flex gap-2 flex-wrap mb-4">
                    {STATUS_TABS.map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all
                ${activeTab === status
                                    ? "bg-[#355872] text-white shadow-sm"
                                    : "bg-white text-gray-500 border border-gray-200 hover:border-[#355872] hover:text-[#355872]"
                                }`}
                        >
                            {status} ({countByStatus(status)})
                        </button>
                    ))}
                </div>

                {/* ── Orders Table (paginated slice) ── */}
                <OrdersTable
                    orders={paginatedOrders}
                    loading={loading}
                    error={error}
                    onAccept={(order) => openModal("accept", order)}
                    onReject={(order) => openModal("reject", order)}
                    onUpdateStatus={(order) => openModal("status", order)}
                    onRetry={fetchOrders}
                />

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">

                        {/* Info */}
                        <p className="text-xs text-gray-500">
                            Showing{" "}
                            <span className="font-semibold text-gray-700">
                                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}
                            </span>{" "}
                            of <span className="font-semibold text-gray-700">{filteredOrders.length}</span> orders
                        </p>

                        {/* Page Buttons */}
                        <div className="flex items-center gap-1">
                            {/* Prev */}
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                ← Prev
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((item, idx) =>
                                    item === "..." ? (
                                        <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">…</span>
                                    ) : (
                                        <button
                                            key={item}
                                            onClick={() => setCurrentPage(item)}
                                            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all
                        ${currentPage === item
                                                    ? "bg-[#355872] text-white shadow-sm"
                                                    : "text-gray-600 border border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    )
                                )}

                            {/* Next */}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <OrderStatusModal
                mode={modalMode}
                order={selectedOrder}
                loading={actionLoading}
                error={actionError}
                onAccept={handleAccept}
                onReject={handleReject}
                onUpdateStatus={handleUpdateStatus}
                onClose={closeModal}
            />
        </div>
    );
}