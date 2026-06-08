import { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { categoryService } from "../../services/categoryServices";
import CategoryFilters from "../../components/CategoryFilters";
import CategoryTable from "../../components/CategoryTable";
import CategoryModal from "../../components/CategoryModal";

const LIMIT = 5;

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [appliedFilters, setAppliedFilters] = useState({ sort: "-createdAt", search: "" });
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [modalMode, setModalMode] = useState(null);
    const [selectedCategory, setSelected] = useState(null);
    const [actionLoading, setActionLoad] = useState(false);
    const [actionError, setActionError] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAllCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error("Failed to load categories");
            console.log(err);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const processedCategories = useMemo(() => {
        let result = [...categories];

        if (appliedFilters.search) {
            const s = appliedFilters.search.toLowerCase();
            result = result.filter(c => c.categoryname?.toLowerCase().includes(s));
        }

        result.sort((a, b) => {
            if (appliedFilters.sort === "createdAt") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (appliedFilters.sort === "-createdAt") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (appliedFilters.sort === "categoryname") {
                return a.categoryname.localeCompare(b.categoryname);
            } else if (appliedFilters.sort === "-categoryname") {
                return b.categoryname.localeCompare(a.categoryname);
            }
            return 0;
        });

        return result;
    }, [categories, appliedFilters]);

    const totalResults = processedCategories.length;
    const totalPages = Math.ceil(totalResults / LIMIT);
    const paginatedCategories = processedCategories.slice((page - 1) * LIMIT, page * LIMIT);

    const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
        setSearch(filters.search || "");
        setPage(1);
    };

    const handleClearFilters = () => {
        setAppliedFilters({ sort: "-createdAt", search: "" });
        setSearch("");
        setPage(1);
    };

    const openModal = (mode, category = null) => { setModalMode(mode); setSelected(category); setActionError(null); };
    const closeModal = () => { setModalMode(null); setSelected(null); setActionError(null); };

    const runAction = async (fn, successMessage) => {
        setActionLoad(true);
        setActionError(null);
        try {
            await fn();
            toast.success(successMessage);
            closeModal();
            fetchCategories();
        } catch (err) {
            setActionError(err.response?.data?.message || err.message || "An error occurred");
        } finally {
            setActionLoad(false);
        }
    };

    const handleCreate = (data) => runAction(() => categoryService.createCategory(data), "Category created successfully!");
    const handleUpdate = (data) => runAction(() => categoryService.updateCategory(selectedCategory.ID, data), "Category updated successfully!");
    const handleDelete = () => runAction(() => categoryService.deleteCategory(selectedCategory.ID), "Category deleted successfully!");

    return (
        <div className="min-h-screen bg-[#f4f7fa] font-sans">
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-[#355872]">Categories</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {loading ? "Loading..." : `${totalResults.toLocaleString()} categories total`}
                    </p>
                </div>
                <button
                    onClick={() => openModal("create")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#355872] text-white text-sm font-semibold hover:bg-[#2a4760] active:scale-95 transition-all shadow-md shadow-[#355872]/20"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                </button>
            </div>

            <div className="px-6 py-5 max-w-screen-xl mx-auto">
                <CategoryFilters
                    search={search}
                    onSearchChange={setSearch}
                    onApply={handleApplyFilters}
                />
                <CategoryTable
                    categories={paginatedCategories}
                    loading={loading}
                    search={search}
                    totalResults={totalResults}
                    page={page}
                    totalPages={totalPages}
                    limit={LIMIT}
                    onEdit={(c) => openModal("edit", c)}
                    onDelete={(c) => openModal("delete", c)}
                    onClear={handleClearFilters}
                    onPageChange={setPage}
                />
            </div>

            <CategoryModal
                mode={modalMode}
                category={selectedCategory}
                loading={actionLoading}
                error={actionError}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onClose={closeModal}
            />
            <ToastContainer />
        </div>
    );
}