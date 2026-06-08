import { useState, useRef } from "react";

const SORT_OPTIONS = [
    { value: "-createdAt", label: "Newest First" },
    { value: "createdAt", label: "Oldest First" },
    { value: "categoryname", label: "Name A→Z" },
    { value: "-categoryname", label: "Name Z→A" },
];

const Label = ({ children }) => (
    <label className="text-xs font-medium text-gray-500 mb-1 block">{children}</label>
);

const inputClass =
    "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#355872]/20 focus:border-[#355872] transition-colors";

const CategoryFilters = ({ onApply, onSearchChange, search }) => {
    const [pending, setPending] = useState({ sort: "-createdAt" });
    const searchTimer = useRef(null);

    const handleSearchInput = (e) => {
        const val = e.target.value;
        onSearchChange(val);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => onApply({ ...pending, search: val }), 400);
    };

    const handleApply = () => onApply({ ...pending });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
            <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[220px]">
                    <Label>Search Categories</Label>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchInput}
                            placeholder="Search by category name..."
                            className={`${inputClass} pl-9`}
                        />
                    </div>
                </div>

                <div className="min-w-[175px]">
                    <Label>Sort By</Label>
                    <select
                        value={pending.sort}
                        onChange={(e) => setPending({ sort: e.target.value })}
                        className={inputClass}
                    >
                        {SORT_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2 self-end">
                    <button
                        onClick={handleApply}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#355872] text-white text-sm font-semibold hover:bg-[#2a4760] transition-colors"
                    >
                        Apply Filters
                    </button>
                    {(pending.sort !== "-createdAt" || search) && (
                        <button
                            onClick={() => {
                                setPending({ sort: "-createdAt" });
                                onSearchChange("");
                                onApply({ sort: "-createdAt", search: "" });
                            }}
                            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryFilters;
