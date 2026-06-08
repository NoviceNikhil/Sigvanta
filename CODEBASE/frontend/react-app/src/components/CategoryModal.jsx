import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

// Predefined Tailored colors mapping user snippet
const COLORS = [
    "bg-blue-500", "bg-green-500", "bg-orange-500", "bg-purple-500",
    "bg-pink-500", "bg-teal-500", "bg-red-500", "bg-yellow-500",
    "bg-indigo-500", "bg-cyan-500", "bg-lime-500", "bg-fuchsia-500",
    "bg-rose-500", "bg-emerald-500", "bg-sky-500", "bg-violet-500",
];

// Resolving dynamic icon keys
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

const useScrollLock = () => {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = originalOverflow };
    }, []);
};

const ModalShell = ({ title, onClose, children }) => {
    useScrollLock();
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[500px] flex flex-col max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                        <LucideIcons.X size={20} />
                    </button>
                </div>
                <div className="px-6 py-6">{children}</div>
            </div>
        </div>
    );
};

const Spinner = () => (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
);

const CategoryModal = ({ mode, category, loading, error, onCreate, onUpdate, onDelete, onClose }) => {
    const [name, setName] = useState(category?.categoryname || "");
    const [icon, setIcon] = useState(category?.icon || "ShoppingBag");
    const [color, setColor] = useState(category?.color || "bg-blue-500");

    useEffect(() => {
        setName(category?.categoryname || "");
        setIcon(category?.icon || "ShoppingBag");
        setColor(category?.color || "bg-blue-500");
    }, [category]);

    if (!mode) return null;

    if (mode === "delete") {
        return (
            <ModalShell title="Delete Category" onClose={onClose}>
                {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">{error}</div>}
                <div className="flex flex-col items-center gap-5 py-2">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <LucideIcons.Trash2 className="w-7 h-7 text-red-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-gray-800 font-medium">Are you sure you want to delete</p>
                        <p className="text-[#355872] font-semibold mt-1 text-sm line-clamp-2">"{category?.categoryname}"</p>
                        <p className="text-gray-500 text-sm mt-2">This will permanently remove the category.</p>
                    </div>
                    <div className="flex gap-3 w-full mt-4">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button onClick={onDelete} disabled={loading} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading && <Spinner />} Delete
                        </button>
                    </div>
                </div>
            </ModalShell>
        );
    }

    const isEdit = mode === "edit";

    return (
        <ModalShell title={isEdit ? "Edit Category" : "Add New Category"} onClose={onClose}>
            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-sm text-red-700">
                <LucideIcons.AlertCircle size={18} />
                {error}
            </div>}
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Category Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter category name"
                        className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#355872]/30 focus:border-[#355872] transition-colors text-gray-800"
                    />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Select Icon *</label>
                    <div className="grid grid-cols-6 gap-3">
                        {Object.keys(ICONS).map((iconKey) => {
                            const IconComponent = ICONS[iconKey];
                            if (!IconComponent) return null;
                            const isSelected = icon === iconKey;
                            return (
                                <button
                                    type="button"
                                    key={iconKey}
                                    onClick={() => setIcon(iconKey)}
                                    className={`aspect-square flex items-center justify-center rounded-xl transition-all duration-200 ${isSelected
                                        ? "bg-[#355872] text-white shadow-lg shadow-[#355872]/40 scale-105 ring-2 ring-[#355872]/50 ring-offset-2"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                        }`}
                                    title={iconKey}
                                >
                                    <IconComponent size={20} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Select Color *</label>
                    <div className="flex flex-wrap gap-3">
                        {COLORS.map((c) => (
                            <button
                                type="button"
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-9 h-9 rounded-full ${c} transition-all duration-200 ${color === c
                                    ? "ring-2 ring-gray-400 ring-offset-2 scale-110"
                                    : "opacity-60 hover:opacity-100 hover:scale-105"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => isEdit ? onUpdate({ categoryname: name, icon, color }) : onCreate({ categoryname: name, icon, color })}
                    disabled={loading || !name.trim()}
                    className="mt-4 w-full py-3.5 rounded-xl bg-[#355872] text-white font-bold hover:bg-[#2a4760] transition shadow-xl shadow-[#355872]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading && <Spinner />}
                    {isEdit ? "Save Changes" : "Create Category"}
                </button>
            </div>
        </ModalShell>
    );
};

export default CategoryModal;
