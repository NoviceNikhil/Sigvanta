import { useState, useEffect, useRef } from "react";
import categoryService from "../services/categoryServices";

// ─── Constants ─────────────────────────────────────────────────────────────────

const STOCK_LEVELS = [
    { value: "", label: "All Stock Levels" },
    { value: "out", label: "Out of Stock" },
    { value: "low", label: "Low (1–50)" },
    { value: "medium", label: "Medium (51–150)" },
    { value: "high", label: "High (150+)" },
];

const SORT_OPTIONS = [
    { value: "", label: "Latest First" },
    { value: "name", label: "Name A→Z" },
    { value: "-name", label: "Name Z→A" },
    { value: "discount_price", label: "Price Low→High" },
    { value: "-discount_price", label: "Price High→Low" },
    { value: "stock_quantity", label: "Stock Low→High" },
    { value: "-stock_quantity", label: "Stock High→Low" },
    { value: "-rating", label: "Rating High→Low" },
];

const RATING_OPTIONS = [
    { value: "", label: "Any Rating" },
    { value: "4", label: "4★ & above" },
    { value: "3", label: "3★ & above" },
    { value: "2", label: "2★ & above" },
];

const INITIAL_FILTERS = {
    categoryname: "",
    stockLevel: "",
    priceMin: "",
    priceMax: "",
    ratingMin: "",
    sort: "",
};

// ─── Small Reusable UI Pieces ──────────────────────────────────────────────────

const Label = ({ children }) => (
    <label className="text-xs font-medium text-gray-500 mb-1 block">{children}</label>
);

const inputClass =
    "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#355872]/20 focus:border-[#355872] transition-colors";

// ─── InventoryFilters Component ────────────────────────────────────────────────

/**
 * Props:
 *  onApply(filters)      — called when "Apply Filters" is clicked
 *  onSearchChange(value) — called instantly as user types in search (debounced)
 *  search                — controlled search value from parent
 */
const InventoryFilters = ({ onApply, onSearchChange, search }) => {
    // Pending filter state — only sent to parent on "Apply Filters"
    const [pending, setPending] = useState(INITIAL_FILTERS);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Debounce ref for search
    const searchTimer = useRef(null);

    // Fetch categories once on mount
    useEffect(() => {
        categoryService.getAllCategories()
            .then(setCategories)
            .catch(console.error)
            .finally(() => setCategoriesLoading(false));
    }, []);

    // Update a single pending filter field
    const setField = (field) => (e) =>
        setPending((prev) => ({ ...prev, [field]: e.target.value }));

    // Debounced search — triggers instantly without needing Apply button
    const handleSearchInput = (e) => {
        const val = e.target.value;
        onSearchChange(val); // parent updates search state immediately for display
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => onApply({ ...pending, search: val }), 400);
    };

    const handleApply = () => onApply({ ...pending });

    const handleClear = () => {
        const cleared = INITIAL_FILTERS;
        setPending(cleared);
        onSearchChange("");
        onApply({ ...cleared, search: "" });
    };

    const hasActiveFilters = Object.values(pending).some(Boolean) || search;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
            <div className="flex flex-wrap gap-3 items-end">

                {/* Search — instant, no apply needed */}
                <div className="flex-1 min-w-[220px]">
                    <Label>Search</Label>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchInput}
                            placeholder="Search by name or category..."
                            className={`${inputClass} pl-9`}
                        />
                    </div>
                </div>

                {/* Category — dropdown from API */}
                <div className="min-w-[180px]">
                    <Label>Category</Label>
                    <select value={pending.categoryname} onChange={setField("categoryname")} className={inputClass}>
                        <option value="">All Categories</option>
                        {categoriesLoading ? (
                            <option disabled>Loading...</option>
                        ) : (
                            categories.map((cat) => (
                                <option key={cat.ID} value={cat.categoryname}>
                                    {cat.categoryname}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {/* Stock Level */}
                <div className="min-w-[160px]">
                    <Label>Stock Level</Label>
                    <select value={pending.stockLevel} onChange={setField("stockLevel")} className={inputClass}>
                        {STOCK_LEVELS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div className="min-w-[200px]">
                    <Label>Price Range (₹)</Label>
                    <div className="flex items-center gap-1.5">
                        <input
                            type="number"
                            value={pending.priceMin}
                            onChange={setField("priceMin")}
                            placeholder="Min"
                            className={inputClass}
                        />
                        <span className="text-gray-400 text-xs flex-shrink-0">–</span>
                        <input
                            type="number"
                            value={pending.priceMax}
                            onChange={setField("priceMax")}
                            placeholder="Max"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Min Rating */}
                <div className="min-w-[140px]">
                    <Label>Min Rating</Label>
                    <select value={pending.ratingMin} onChange={setField("ratingMin")} className={inputClass}>
                        {RATING_OPTIONS.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                </div>

                {/* Sort By */}
                <div className="min-w-[175px]">
                    <Label>Sort By</Label>
                    <select value={pending.sort} onChange={setField("sort")} className={inputClass}>
                        {SORT_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end">
                    <button
                        onClick={handleApply}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#355872] text-white text-sm font-semibold hover:bg-[#2a4760] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Apply Filters
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default InventoryFilters;