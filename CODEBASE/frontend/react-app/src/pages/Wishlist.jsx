import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { wishlistService } from "../services/wishlistServices";
import { cartService } from "../services/cartServices"; // <-- Added cart service
import Card from "../components/Card";

const Wishlist = () => {
    const user = useSelector(state => state.auth.user)
    console.log(user)
    const userId = user.id
    const navigate = useNavigate();

    // --- STATES ---
    const [currentUser, setCurrentUser] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartTotal, setCartTotal] = useState(0); // <-- Added cart total state

    // --- DROPDOWN STATES ---
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSignout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            navigate("/");
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // ✅ FETCH USER
    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    // ✅ FETCH CART TOTAL
    const fetchCartTotal = useCallback(async () => {
        const activeUserId = userId || currentUser?.id;
        if (!activeUserId) return;
        try {
            const cartData = await cartService.getCart(activeUserId);
            const items = cartData.data || cartData || [];
            const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartTotal(total);
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Failed to fetch cart total:", error);
        }
    }, [userId, currentUser?.id]);

    useEffect(() => {
        fetchCartTotal();
    }, [fetchCartTotal]);

    // ✅ FETCH WISHLIST FROM BACKEND
    const fetchWishlist = async () => {
        const activeUserId = userId || currentUser?.id;
        if (!activeUserId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await wishlistService.getWishlist(activeUserId);

            // Map backend response: items have nested Product object
            const mappedData = data?.map((item) => {
                const product = item.Product || item;
                return {
                    ID: product.ID || item.product_id,
                    name: product.name,
                    image: product.image,
                    actual_price: product.actual_price,
                    discount_price: product.discount_price,
                    rating: product.rating,
                    description: product.description,
                    category: product.category,
                };
            });

            setWishlist(mappedData || []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [userId, currentUser?.id]);

    return (
        <div className="min-h-screen bg-[#f4f7fa] pb-12 font-sans">
            {/* ✅ HEADER */}


            {/* ✅ CONTENT */}
            <div className="max-w-7xl mx-auto px-8 mt-12">
                <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 mb-8">
                    <Heart className="text-rose-500 fill-rose-500" />
                    My Saved Items
                </h2>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="w-10 h-10 border-4 border-t-[#355872] border-slate-200 rounded-full animate-spin"></div>
                    </div>
                ) : !userId && !currentUser?.id ? (
                    <div className="text-center p-20 bg-white rounded-3xl shadow-sm">
                        <h2 className="text-xl font-bold">
                            Please log in to view your wishlist
                        </h2>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 px-8 py-3 bg-[#355872] text-white font-bold rounded-xl"
                        >
                            Go to Homepage
                        </button>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center p-20 bg-white rounded-3xl shadow-sm">
                        <Heart className="mx-auto text-slate-200 mb-4" size={48} />
                        <h2 className="text-xl font-bold">Your wishlist is empty</h2>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 px-8 py-3 bg-[#355872] text-white font-bold rounded-xl"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((item) => (
                            <Card
                                key={item.ID}
                                ID={item.ID}
                                name={item.name}
                                image={item.image}
                                actual_price={item.actual_price}
                                discount_price={item.discount_price}
                                rating={item.rating}
                                description={item.description}
                                category={item.category}
                                userId={userId || currentUser?.id}
                                initialWishlist={true}
                                onWishlistUpdate={fetchWishlist}
                                onCartUpdate={fetchCartTotal} // <-- Triggers cart badge update!
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
