// ─── Stock Helpers ─────────────────────────────────────────────────────────────

const getStockMeta = (qty) => {
    if (qty === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200", bar: "bg-red-500" };
    if (qty <= 50) return { label: "Low", color: "bg-amber-100 text-amber-700 border-amber-200", bar: "bg-amber-500" };
    if (qty <= 150) return { label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-200", bar: "bg-yellow-400" };
    return { label: "High", color: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-500" };
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
        <span className="text-xs text-gray-500 ml-0.5">{Number(rating).toFixed(1)}</span>
    </div>
);

const StockBadge = ({ quantity }) => {
    const { label, color, bar } = getStockMeta(quantity);
    const barWidth = Math.min(100, Math.round((quantity / 300) * 100));
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}>{label}</span>
                <span className="text-xs text-gray-500 font-medium">{quantity} units</span>
            </div>
            <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${bar}`} style={{ width: `${barWidth}%` }} />
            </div>
        </div>
    );
};

const SkeletonRow = () => (
    <tr className="border-b border-gray-50 animate-pulse">
        <td className="px-4 py-3.5"><div className="w-12 h-12 bg-gray-100 rounded-xl" /></td>
        <td className="px-4 py-3.5"><div className="h-4 bg-gray-100 rounded w-48" /><div className="h-3 bg-gray-100 rounded w-24 mt-1.5" /></td>
        <td className="px-4 py-3.5"><div className="h-4 bg-gray-100 rounded w-28" /></td>
        <td className="px-4 py-3.5"><div className="h-4 bg-gray-100 rounded w-20" /></td>
        <td className="px-4 py-3.5"><div className="h-4 bg-gray-100 rounded w-16" /></td>
        <td className="px-4 py-3.5"><div className="h-4 bg-gray-100 rounded w-20" /></td>
        <td className="px-4 py-3.5"><div className="h-8 bg-gray-100 rounded-lg w-24 ml-auto" /></td>
    </tr>
);

const EmptyState = ({ hasActiveFilters, onClear }) => (
    <tr>
        <td colSpan={7} className="px-6 py-16 text-center">
            <div className="flex flex-col items-center gap-3">
                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 text-sm font-medium">No products found</p>
                {hasActiveFilters && (
                    <button onClick={onClear} className="text-sm text-[#355872] underline">Clear filters</button>
                )}
            </div>
        </td>
    </tr>
);

const ProductRow = ({ product, onEdit, onDelete }) => {
    const qty = product.Inventory?.stock_quantity ?? 0;
    return (
        <tr className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors group">

            {/* Image */}
            <td className="px-4 py-3.5">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-contain rounded-xl bg-gray-50 border border-gray-100"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48?text=?"; }}
                    />
                ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </td>

            {/* Name */}
            <td className="px-4 py-3.5 max-w-[280px]">
                <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-[#355872] transition-colors">
                    {product.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">ID: {product.ID}</p>
            </td>

            {/* Category */}
            <td className="px-4 py-3.5">
                <span className="text-sm text-gray-600 capitalize">{product.Category?.categoryname ?? "—"}</span>
            </td>

            {/* Stock */}
            <td className="px-4 py-3.5">
                <StockBadge quantity={qty} />
            </td>

            {/* Price */}
            <td className="px-4 py-3.5">
                <p className="text-sm font-bold text-gray-800">₹{Number(product.discount_price).toLocaleString()}</p>
                <p className="text-xs text-gray-400 line-through">₹{Number(product.actual_price).toLocaleString()}</p>
            </td>

            {/* Rating */}
            <td className="px-4 py-3.5">
                <StarRating rating={product.rating} />
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onEdit(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#355872] border border-[#355872]/30 hover:bg-[#355872] hover:text-white transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-500 hover:text-white transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

// ─── Pagination ────────────────────────────────────────────────────────────────

const Pagination = ({ page, totalPages, totalResults, limit, loading, onPageChange }) => {
    if (totalPages <= 1) return null;

    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, totalResults);

    // Sliding window of 5 pages
    const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        if (totalPages <= 5) return i + 1;
        if (page <= 3) return i + 1;
        if (page >= totalPages - 2) return totalPages - 4 + i;
        return page - 2 + i;
    });

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-[#f9fbfc]">
            <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{from}–{to}</span> of{" "}
                <span className="font-semibold text-gray-700">{totalResults.toLocaleString()}</span>
            </p>
            <div className="flex items-center gap-1">
                <button onClick={() => onPageChange(page - 1)} disabled={page === 1 || loading}
                    className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-[#355872] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {pageNumbers.map((num) => (
                    <button key={num} onClick={() => onPageChange(num)} disabled={loading}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${num === page ? "bg-[#355872] text-white shadow-sm" : "text-gray-600 hover:bg-white hover:text-[#355872]"}`}>
                        {num}
                    </button>
                ))}
                <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages || loading}
                    className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-[#355872] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
};

// ─── InventoryTable Component ──────────────────────────────────────────────────

/**
 * Props:
 *  products, loading, error, hasActiveFilters
 *  totalResults, page, totalPages, limit
 *  onEdit(product), onDelete(product), onClear(), onRetry(), onPageChange(page)
 */
const InventoryTable = ({
    products, loading, error, hasActiveFilters,
    totalResults, page, totalPages, limit,
    onEdit, onDelete, onClear, onRetry, onPageChange,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border-b border-red-100">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                    <button onClick={onRetry} className="ml-auto text-sm text-red-600 underline">Retry</button>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#f4f7fa] border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-[#355872] px-4 py-3.5 w-16">Image</th>
                            <th className="text-left text-xs font-semibold text-[#355872] px-4 py-3.5">Product Name</th>
                            <th className="text-left text-xs font-semibold text-[#355872] px-4 py-3.5">Category</th>
                            <th className="text-left text-xs font-semibold text-[#355872] px-4 py-3.5 min-w-[160px]">Stock</th>
                            <th className="text-left text-xs font-semibold text-[#355872] px-4 py-3.5">Price</th>
                            <th className="text-left text-xs font-semibold text-[#355872] px-4 py-3.5">Rating</th>
                            <th className="text-right text-xs font-semibold text-[#355872] px-4 py-3.5">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && products.length === 0 ? (
                            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : products.length === 0 ? (
                            <EmptyState hasActiveFilters={hasActiveFilters} onClear={onClear} />
                        ) : (
                            products.map((product) => (
                                <ProductRow key={product.ID} product={product} onEdit={onEdit} onDelete={onDelete} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                totalResults={totalResults}
                limit={limit}
                loading={loading}
                onPageChange={onPageChange}
            />

        </div>
    );
};

export default InventoryTable;