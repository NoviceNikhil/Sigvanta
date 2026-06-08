import { useState, useEffect, useRef } from "react";
import { uploadImage } from "../services/inventoryService";
import categoryService from "../services/categoryServices";

// ─── Constants ─────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
    name: "",
    categoryID: "",
    image: "",
    actual_price: "",
    discount_price: "",
    description: "",
    rating: "",
    stock_quantity: "",
};

// ─── Scroll Lock ───────────────────────────────────────────────────────────────
// Locks background scroll when modal is open, restores it on close

const useScrollLock = () => {
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, []);
};

// ─── Spinner ───────────────────────────────────────────────────────────────────

const Spinner = () => (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
);

// ─── Error Banner ──────────────────────────────────────────────────────────────

const ErrorBanner = ({ message }) => (
    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
        {message}
    </div>
);

// ─── Modal Shell ───────────────────────────────────────────────────────────────

const ModalShell = ({ title, onClose, children }) => {
    useScrollLock();

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            {/* Panel */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-[#355872]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
            </div>
        </div>
    );
};

// ─── Image Upload Field ────────────────────────────────────────────────────────

const ImageUploadField = ({ existingUrl, onFileSelect }) => {
    const [preview, setPreview] = useState(existingUrl || null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file); // local preview, no upload yet
        setPreview(objectUrl);
        onFileSelect(file);
        return () => URL.revokeObjectURL(objectUrl); // cleanup memory
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Product Image</label>
            <div
                onClick={() => fileInputRef.current?.click()}
                className="relative flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#355872]/50 hover:bg-[#f4f7fa]/50 transition-colors"
                style={{ minHeight: preview ? "auto" : "96px" }}
            >
                {preview ? (
                    <div className="flex items-center gap-4 p-3 w-full">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-16 h-16 object-contain rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64?text=?"; }}
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Image selected</p>
                            <p className="text-xs text-[#355872] mt-0.5">Click to change</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-1.5 py-6">
                        <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400">JPG, PNG, WEBP — max 5MB</p>
                    </div>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};

// ─── Text Input Field ──────────────────────────────────────────────────────────

const Field = ({ label, field, type = "text", placeholder, value, onChange, error }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#355872]/30 focus:border-[#355872] transition-colors ${error ? "border-red-400" : "border-gray-200"
                }`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

// ─── Product Form ──────────────────────────────────────────────────────────────

const ProductForm = ({ initial, onSubmit, loading, submitLabel }) => {
    const [form, setForm] = useState(initial);
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Fetch categories on mount — admin sees names, we send ID to backend
    useEffect(() => {
        categoryService.getAllCategories()
            .then(setCategories)
            .catch(console.error)
            .finally(() => setCategoriesLoading(false));
    }, []);

    const setField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.categoryID) errs.categoryID = "Category is required";
        if (!form.actual_price) errs.actual_price = "Actual price is required";
        if (!form.discount_price) errs.discount_price = "Discount price is required";
        if (form.stock_quantity === "") errs.stock_quantity = "Stock quantity is required";
        return errs;
    };

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length) return setErrors(errs);

        // Upload image first if user picked a new file, then submit full form
        let imageUrl = form.image;
        if (imageFile) {
            try {
                imageUrl = await uploadImage(imageFile);
            } catch (err) {
                setErrors((prev) => ({ ...prev, image: `Upload failed: ${err.message}` }));
                return;
            }
        }

        onSubmit({ ...form, image: imageUrl });
    };

    return (
        <div className="flex flex-col gap-4">

            {/* Image */}
            <ImageUploadField existingUrl={form.image} onFileSelect={setImageFile} />
            {errors.image && <p className="text-xs text-red-500 -mt-2">{errors.image}</p>}

            {/* Name */}
            <Field
                label="Product Name *" field="name"
                placeholder="Enter product name"
                value={form.name} onChange={setField} error={errors.name}
            />

            {/* Category + Rating */}
            <div className="grid grid-cols-2 gap-3">
                {/* Category — shows name in dropdown, stores ID in form */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Category *</label>
                    <select
                        value={form.categoryID}
                        onChange={(e) => setField("categoryID", e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#355872]/30 focus:border-[#355872] transition-colors ${errors.categoryID ? "border-red-400" : "border-gray-200"
                            }`}
                    >
                        <option value="">Select category</option>
                        {categoriesLoading ? (
                            <option disabled>Loading...</option>
                        ) : (
                            categories.map((cat) => (
                                <option key={cat.ID} value={cat.ID}>
                                    {cat.categoryname}
                                </option>
                            ))
                        )}
                    </select>
                    {errors.categoryID && <p className="text-xs text-red-500">{errors.categoryID}</p>}
                </div>

                <Field
                    label="Rating" field="rating" type="number"
                    placeholder="3.5"
                    value={form.rating} onChange={setField}
                />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-3">
                <Field label="Actual Price *" field="actual_price" type="number" placeholder="2999" value={form.actual_price} onChange={setField} error={errors.actual_price} />
                <Field label="Discount Price *" field="discount_price" type="number" placeholder="1389" value={form.discount_price} onChange={setField} error={errors.discount_price} />
            </div>

            {/* Stock */}
            <Field
                label="Stock Quantity *" field="stock_quantity" type="number"
                placeholder="100"
                value={form.stock_quantity} onChange={setField} error={errors.stock_quantity}
            />

            {/* Description */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    rows={3}
                    placeholder="Product description..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#355872]/30 focus:border-[#355872] transition-colors resize-none"
                />
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-1 w-full py-2.5 rounded-xl bg-[#355872] text-white text-sm font-semibold hover:bg-[#2a4760] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading && <Spinner />}
                {submitLabel}
            </button>

        </div>
    );
};

// ─── Delete Confirm ────────────────────────────────────────────────────────────

const DeleteConfirm = ({ product, onConfirm, onCancel, loading }) => (
    <div className="flex flex-col items-center gap-5 py-2">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </div>
        <div className="text-center">
            <p className="text-gray-800 font-medium">Are you sure you want to delete</p>
            <p className="text-[#355872] font-semibold mt-1 text-sm line-clamp-2">"{product.name}"</p>
            <p className="text-gray-500 text-sm mt-2">This will permanently remove the product and its inventory record.</p>
        </div>
        <div className="flex gap-3 w-full">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
            </button>
            <button onClick={onConfirm} disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Spinner />}
                Delete
            </button>
        </div>
    </div>
);

// ─── InventoryModal (Main Export) ──────────────────────────────────────────────
/**
 * Single entry point for all 3 modal modes.
 *
 * Props:
 *   mode     — "create" | "edit" | "delete" | null
 *   product  — product object (required for edit/delete)
 *   loading  — boolean, disables submit button
 *   error    — string, shown as red banner inside modal
 *   onCreate(formData)
 *   onUpdate(formData)
 *   onDelete()
 *   onClose()
 */
const InventoryModel = ({ mode, product, loading, error, onCreate, onUpdate, onDelete, onClose }) => {
    if (!mode) return null;

    if (mode === "delete") {
        return (
            <ModalShell title="Delete Product" onClose={onClose}>
                {error && <ErrorBanner message={error} />}
                <DeleteConfirm product={product} onConfirm={onDelete} onCancel={onClose} loading={loading} />
            </ModalShell>
        );
    }

    const isEdit = mode === "edit";

    return (
        <ModalShell title={isEdit ? "Edit Product" : "Add New Product"} onClose={onClose}>
            {error && <ErrorBanner message={error} />}
            <ProductForm
                initial={isEdit ? {
                    name: product.name ?? "",
                    categoryID: product.categoryID ?? "",
                    image: product.image ?? "",
                    actual_price: product.actual_price ?? "",
                    discount_price: product.discount_price ?? "",
                    description: product.description ?? "",
                    rating: product.rating ?? "",
                    stock_quantity: product.Inventory?.stock_quantity ?? "",
                } : EMPTY_FORM}
                onSubmit={isEdit ? onUpdate : onCreate}
                loading={loading}
                submitLabel={isEdit ? "Save Changes" : "Create Product"}
            />
        </ModalShell>
    );
};

export default InventoryModel;