import { useState, useEffect, useCallback } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/inventoryService";
import InventoryFilters from "../../components/InventoryFilters";


import InventoryTable from "../../components/inventoryTable";
import InventoryModal from "../../components/inventorymodel";

const LIMIT = 20;

export default function Inventory() {
    // Data
    const [products, setProducts] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Applied filters - only sent to API when user clicks Apply or types in search
    const [appliedFilters, setAppliedFilters] = useState({
        search: "", categoryname: "", stockLevel: "",
        priceMin: "", priceMax: "", ratingMin: "", sort: "",
    });
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Modal: mode = "create" | "edit" | "delete" | null
    const [modalMode, setModalMode] = useState(null);
    const [selectedProduct, setSelected] = useState(null);
    const [actionLoading, setActionLoad] = useState(false);
    const [actionError, setActionError] = useState(null);

    const totalPages = Math.ceil(totalResults / LIMIT);
    const hasActiveFilters = Object.values(appliedFilters).some(Boolean);

    // Fetch products whenever appliedFilters or page changes
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getProducts({ ...appliedFilters, page, limit: LIMIT });
            setProducts(result.products ?? []);
            setTotalResults(result.results ?? 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [appliedFilters, page]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // Called when user clicks "Apply Filters" or search debounce fires
    const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
        setSearch(filters.search ?? "");
        setPage(1);
    };

    const handleClearFilters = () => {
        const cleared = { search: "", categoryname: "", stockLevel: "", priceMin: "", priceMax: "", ratingMin: "", sort: "" };
        setAppliedFilters(cleared);
        setSearch("");
        setPage(1);
    };

    // Modal helpers
    const openModal = (mode, product = null) => { setModalMode(mode); setSelected(product); setActionError(null); };
    const closeModal = () => { setModalMode(null); setSelected(null); setActionError(null); };

    // Generic action runner - handles loading state, error, close & refetch
    const runAction = async (fn) => {
        setActionLoad(true);
        setActionError(null);
        try { await fn(); closeModal(); fetchProducts(); }
        catch (err) { setActionError(err.message); }
        finally { setActionLoad(false); }
    };

    const handleCreate = (data) => runAction(() => createProduct(data));
    const handleUpdate = (data) => runAction(() => updateProduct(selectedProduct.ID, data));
    const handleDelete = () => runAction(() => deleteProduct(selectedProduct.ID));

    return (
        <div className="min-h-screen bg-[#f4f7fa] font-sans">

            {/* Top Bar */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-[#355872]">Inventory</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {loading ? "Loading..." : `${totalResults.toLocaleString()} products total`}
                    </p>
                </div>
                <button
                    onClick={() => openModal("create")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#355872] text-white text-sm font-semibold hover:bg-[#2a4760] active:scale-95 transition-all shadow-md shadow-[#355872]/20"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </button>
            </div>

            <div className="px-6 py-5 max-w-screen-2xl mx-auto">
                <InventoryFilters
                    search={search}
                    onSearchChange={setSearch}
                    onApply={handleApplyFilters}
                />
                <InventoryTable
                    products={products}
                    loading={loading}
                    error={error}
                    hasActiveFilters={hasActiveFilters}
                    totalResults={totalResults}
                    page={page}
                    totalPages={totalPages}
                    limit={LIMIT}
                    onEdit={(p) => openModal("edit", p)}
                    onDelete={(p) => openModal("delete", p)}
                    onClear={handleClearFilters}
                    onRetry={fetchProducts}
                    onPageChange={setPage}
                />
            </div>

            <InventoryModal
                mode={modalMode}
                product={selectedProduct}
                loading={actionLoading}
                error={actionError}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onClose={closeModal}
            />
        </div>
    );
}