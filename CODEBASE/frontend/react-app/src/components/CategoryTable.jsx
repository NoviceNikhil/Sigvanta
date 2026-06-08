import * as LucideIcons from "lucide-react";

const ICONS = {
    ShoppingBag: LucideIcons.ShoppingBag,
    Coffee: LucideIcons.Coffee,
    Home: LucideIcons.Home,
    Truck: LucideIcons.Truck,
    Activity: LucideIcons.Activity,
    Monitor: LucideIcons.Monitor,
    Smartphone: LucideIcons.Smartphone,
    Gift: LucideIcons.Gift,
    Zap: LucideIcons.Zap,
    Briefcase: LucideIcons.Briefcase,
    Heart: LucideIcons.Heart,
    Music: LucideIcons.Music,
    Book: LucideIcons.Book,
    Plane: LucideIcons.Plane,
    Dumbbell: LucideIcons.Dumbbell,
    Utensils: LucideIcons.Utensils,
    Wifi: LucideIcons.Wifi,
    CreditCard: LucideIcons.CreditCard,
};

const SkeletonRow = () => (
    <tr className="border-b border-gray-50 animate-pulse">
        <td className="px-4 py-3.5"><div className="h-10 w-10 bg-gray-100 rounded-xl" /></td>
        <td className="px-4 py-3.5"><div className="h-4 bg-gray-100 rounded w-12" /></td>
        <td className="px-4 py-3.5"><div className="h-4 bg-gray-100 rounded w-48" /></td>
        <td className="px-4 py-3.5"><div className="h-4 bg-gray-100 rounded w-28" /></td>
        <td className="px-4 py-3.5"><div className="h-8 bg-gray-100 rounded-lg w-24 ml-auto" /></td>
    </tr>
);

const EmptyState = ({ onClear, hasSearch }) => (
    <tr>
        <td colSpan={5} className="px-6 py-16 text-center">
            <div className="flex flex-col items-center gap-3">
                <LucideIcons.ShoppingBag className="w-12 h-12 text-gray-200" />
                <p className="text-gray-500 text-sm font-medium">No categories found</p>
                {hasSearch && (
                    <button onClick={onClear} className="text-sm text-[#355872] underline">Clear search</button>
                )}
            </div>
        </td>
    </tr>
);

const Pagination = ({ page, totalPages, totalResults, limit, loading, onPageChange }) => {
    if (totalPages <= 1) return null;

    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, totalResults);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-[#f9fbfc]">
            <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{from}–{to}</span> of{" "}
                <span className="font-semibold text-gray-700">{totalResults.toLocaleString()}</span>
            </p>
            <div className="flex items-center gap-1">
                <button onClick={() => onPageChange(page - 1)} disabled={page === 1 || loading}
                    className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-[#355872] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <LucideIcons.ChevronLeft size={16} />
                </button>
                {pageNumbers.map((num) => (
                    <button key={num} onClick={() => onPageChange(num)} disabled={loading}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${num === page ? "bg-[#355872] text-white shadow-sm" : "text-gray-600 hover:bg-white hover:text-[#355872]"}`}>
                        {num}
                    </button>
                ))}
                <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages || loading}
                    className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-[#355872] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <LucideIcons.ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

const CategoryTable = ({
    categories, loading, search,
    page, limit, totalPages, totalResults,
    onEdit, onDelete, onClear, onPageChange
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#f4f7fa] border-b border-gray-100">
                            <th className="text-center text-xs font-semibold text-[#355872] px-4 py-3.5 w-16">Icon</th>
                            <th className="text-left text-xs font-semibold text-[#355872] px-4 py-3.5 w-16">ID</th>
                            <th className="text-left text-xs font-semibold text-[#355872] px-4 py-3.5">Category Name</th>
                            <th className="text-left text-xs font-semibold text-[#355872] px-4 py-3.5">Last Updated</th>
                            <th className="text-right text-xs font-semibold text-[#355872] px-4 py-3.5">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && categories.length === 0 ? (
                            Array.from({ length: limit }).map((_, i) => <SkeletonRow key={i} />)
                        ) : categories.length === 0 ? (
                            <EmptyState hasSearch={Boolean(search)} onClear={onClear} />
                        ) : (
                            categories.map((cat) => {
                                const IconComponent = ICONS[cat.icon] || ICONS.ShoppingBag;
                                const colorClass = cat.color || "bg-blue-500";
                                const isUpdated = cat.updatedAt && cat.createdAt && (new Date(cat.updatedAt).getTime() - new Date(cat.createdAt).getTime() > 1000);
                                return (
                                    <tr key={cat.ID} className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors group">
                                        <td className="px-4 py-3.5 flex justify-center">
                                            <div className={`w-11 h-11 ${colorClass} bg-opacity-15 flex items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5`}>
                                                <IconComponent className={`${colorClass.replace("bg-", "text-")}`} size={22} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-sm text-gray-600">#{cat.ID}</td>
                                        <td className="px-4 py-3.5 text-base font-semibold text-gray-800">{cat.categoryname}</td>
                                        <td className="px-4 py-3.5 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                {new Date(isUpdated ? cat.updatedAt : cat.createdAt).toLocaleDateString()}
                                                {isUpdated && (
                                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#355872]/10 text-[#355872]" title="This category has been edited">
                                                        Edited
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit(cat)}
                                                    className="p-2 rounded-lg transition hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                                                    title="Edit"
                                                >
                                                    <LucideIcons.Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(cat)}
                                                    className="p-2 rounded-lg transition text-red-500 hover:bg-red-500/10"
                                                    title="Delete"
                                                >
                                                    <LucideIcons.Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
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

export default CategoryTable;
