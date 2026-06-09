import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdFavoriteBorder, MdFavorite, MdShoppingCart, MdMenu } from "react-icons/md";
import { useState, useEffect } from "react";
import { cartService } from "../services/cartServices";
import { API_BASE_URL } from "../config";

const AdminHeader = ({ onMenuClick }) => {
    const location = useLocation();
    const isWishlistPage = location.pathname === "/user/wishlist";
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const profilePicture =
        currentUser?.profilePicture ||
        `${API_BASE_URL}/avatars/${currentUser?.ProfileIcon || "boy.png"}`;
    const isProfilePage =
        location.pathname === "/admin/profile" || location.pathname === "/user/profile";

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (!currentUser?.id) return;
        const fetchCartCount = async () => {
            try {
                const response = await cartService.getCart(currentUser.id);
                const items = response.data || response || [];
                const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                setCartCount(total);
            } catch (err) {
                console.error("Failed to fetch cart count:", err);
            }

        };
        fetchCartCount();
        window.addEventListener("cartUpdated", fetchCartCount);
        return () => window.removeEventListener("cartUpdated", fetchCartCount);
    }, [currentUser?.id, location.pathname]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm">
            <div className="h-full px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-700"
                        aria-label="Open sidebar"
                    >
                        <MdMenu size={22} />
                    </button>
                    <Link to="/">
                        <div className="flex items-center gap-2 select-none">
                            <div className="w-8 h-8 bg-[#355872] rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
                                Sigvanta
                            </span>
                        </div>
                    </Link>

                </div>

                <div className="flex items-center gap-3 md:gap-5">
                    <Link
                        to="/user/wishlist"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                    >
                        {isWishlistPage
                            ? <MdFavorite size={20} className="text-rose-500" />
                            : <MdFavoriteBorder size={20} className="text-slate-700" />
                        }
                        <span className={`hidden md:inline text-sm font-medium ${isWishlistPage ? "text-rose-500" : ""}`}>
                            Wishlist
                        </span>
                    </Link>

                    <Link
                        to="/user/cart"
                        className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                    >
                        <MdShoppingCart size={20} />
                        <span className="hidden md:inline text-sm font-medium">Cart</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#355872] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <div
                        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-[#355872]"
                    >
                        {isProfilePage ? (
                            <img
                                src={profilePicture}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Link
                                to={currentUser?.role === "admin" ? "/admin/profile" : "/user/profile"}
                                className="block w-full h-full"
                            >
                                <img
                                    src={profilePicture}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
