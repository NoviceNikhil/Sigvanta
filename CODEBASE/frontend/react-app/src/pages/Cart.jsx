
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cartService } from "../services/cartServices";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";


const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-in-center">
                <h2 className="text-xl font-bold mb-2 text-gray-900">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex space-x-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};



function Cart() {

    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user)
    console.log(user)
    const userId = user.id

    // --- UI & AUTH STATES ---
    const [currentUser, setCurrentUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // --- CART DATA STATES ---
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, productId: null });

    // --- INVENTORY ALERT STATE ---
    const [inventoryAlert, setInventoryAlert] = useState({ isOpen: false, message: "" });
    const showInventoryAlert = (message) => setInventoryAlert({ isOpen: true, message });
    const closeInventoryAlert = () => setInventoryAlert({ isOpen: false, message: "" });

    // --- CHECKOUT MODAL STATE ---
    const [checkoutModal, setCheckoutModal] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null); // array of out-of-stock items

    const handleCheckoutConfirm = async () => {
        setCheckoutLoading(true);
        setCheckoutError(null);
        try {

            // All stock checks passed — place the order
            await cartService.placeOrder(userId);
            setCheckoutModal(false);
            setCheckoutLoading(false);
            navigate("/user/orders");
            //   fetchCartData();
            // navigate("/order-success"); // uncomment when you have this page
        } catch (err) {
            console.log(err)
            setCheckoutError([{ name: "Unexpected error. Please try again." }]);
            setCheckoutLoading(false);
        }
    };

    const fetchCartData = async () => {
        try {
            const response = await cartService.getCart(userId);
            setCartItems(response.data || []);
            setLoading(false);
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Error fetching cart:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch user details for the header
    useEffect(() => {
        setCurrentUser(user)
    }, [user]);



    // Modal Handlers
    const openDeleteModal = (productId) => {
        setModalConfig({ isOpen: true, type: 'DELETE_ITEM', productId });
    };

    const openClearModal = () => {
        setModalConfig({ isOpen: true, type: 'CLEAR_CART', productId: null });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, type: null, productId: null });
    };

    const handleConfirmAction = async () => {
        if (modalConfig.type === 'DELETE_ITEM') {
            await cartService.removeProduct(userId, modalConfig.productId);
        } else if (modalConfig.type === 'CLEAR_CART') {
            await cartService.clearCart(userId);
        }
        closeModal();
        fetchCartData();
    };

    // Quantity Handlers
    const handleIncrement = async (productId) => {
        try {
            await cartService.incrementItem(userId, productId);
            fetchCartData();
        } catch (err) {
            showInventoryAlert(err.response?.data?.message || "Inventory limit reached");
        }
    };

    const handleDecrement = async (productId) => {
        await cartService.decrementItem(userId, productId);
        fetchCartData();
    };

    const handleManualUpdate = async (productId, newQty) => {
        const quantity = parseInt(newQty);
        if (!isNaN(quantity) && quantity >= 0) {
            try {
                await cartService.updateQuantity(userId, productId, quantity);
                fetchCartData();
            } catch (error) {
                showInventoryAlert(error.response?.data?.message || "Inventory limit reached");
                fetchCartData();
            }
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.quantity * (item.Product?.discount_price || 0)), 0);
    };

    if (loading) return <div className="text-white text-center mt-20">Loading Cart...</div>;

    return (
        <>

            {/* <header className="flex items-center justify-between px-8 py-4 backdrop-filter backdrop-blur-xl bg-white/40 shadow-sm border-b border-white/50 sticky top-0 z-50">
                <div
                    className="flex items-center space-x-2 cursor-pointer group"
                    onClick={() => navigate("/")}
                >
                    <div className="w-8 h-8 bg-[#355872] rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="text-xl font-extrabold text-slate-800 tracking-tight">
                        Sigvanta
                    </span>
                </div>

                <div className="flex items-center space-x-5">
                    <button
                        onClick={() => navigate("/user/wishlist")}
                        className="p-2.5 bg-white/50 rounded-full border border-white/60 text-slate-600 hover:text-rose-500 hover:bg-white transition-all shadow-sm active:scale-95"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>



                    {/* Profile Dropdown Container */}
            {/* <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2.5 bg-[#355872]/10 rounded-full border border-[#355872]/20 text-[#355872] hover:bg-[#355872] hover:text-white transition-all shadow-sm active:scale-95"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </button>

                        <div
                            className={`absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl transition-all duration-300 z-[60] p-4 ${isDropdownOpen
                                    ? "opacity-100 translate-y-0 pointer-events-auto"
                                    : "opacity-0 translate-y-2 pointer-events-none"
                                }`}
                        >
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                Account
                            </p>

                            <div className="space-y-0.5 mb-4">
                                {currentUser ? (
                                    <>
                                        <div className="text-base font-extrabold text-slate-900 truncate">
                                            {currentUser.name || currentUser.username || "User"}
                                        </div>
                                        <div className="text-xs italic text-slate-500 truncate">
                                            {currentUser.email}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-sm font-bold text-slate-500">
                                        Guest
                                    </div>
                                )}
                            </div>

                            <hr className="my-3 border-slate-100" />
                            <button className="w-full text-left text-sm font-bold text-slate-700 hover:text-[#355872] py-1 transition-colors">
                                Order History
                            </button>
                            <button className="w-full text-left text-sm font-bold text-slate-700 hover:text-[#355872] py-1 mt-2 transition-colors">
                                Profile
                            </button>
                            <button className="w-full text-left text-sm font-bold text-rose-500 hover:text-rose-600 py-1 mt-2 transition-colors">
                                Logout
                            </button>
                        </div>
                    </div>
                </div> */}
            {/* </header> */}


            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.type === 'CLEAR_CART' ? "Clear Entire Cart?" : "Remove Item?"}
                message={modalConfig.type === 'CLEAR_CART'
                    ? "Are you sure you want to remove all products? This cannot be undone."
                    : "Are you sure you want to remove this product from your cart?"}
                onConfirm={handleConfirmAction}
                onCancel={closeModal}
            />

            {/* Inventory Alert Modal */}
            {/* Inventory Alert Modal */}
            {inventoryAlert.isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            {/* FIX: Put the dynamic message here so it's the main focus */}
                            <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-tight">
                                Inventory Notice
                            </h3>
                        </div>

                        {/* This will now show: "Only 141 items in stock" */}
                        <p className="text-sm font-medium text-slate-600 mb-6">
                            {inventoryAlert.message}
                        </p>

                        <button
                            onClick={closeInventoryAlert}
                            className="w-full bg-[#355872] hover:bg-[#274256] text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
            {/* Checkout Confirmation Modal */}
            {checkoutModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200">

                        {/* Header */}
                        <div className="flex items-center space-x-3 mb-5">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#355872]/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#355872]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-gray-900">Confirm Your Order</h3>
                                <p className="text-xs text-gray-400">Review your items before placing the order</p>
                            </div>
                        </div>

                        {/* Cart summary */}
                        <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100 mb-4 max-h-56 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div key={item.product_id} className="flex items-center justify-between px-4 py-2.5">
                                    <div className="flex items-center space-x-2 min-w-0">
                                        <img
                                            src={item.Product?.image}
                                            alt={item.Product?.name}
                                            className="w-8 h-8 rounded-lg object-contain border border-gray-200 flex-shrink-0"
                                        />
                                        <span className="text-sm font-semibold text-gray-700 truncate">{item.Product?.name}</span>
                                        <span className="text-xs text-gray-400 flex-shrink-0">×{item.quantity}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800 ml-3 flex-shrink-0">
                                        ₹{(item.quantity * parseFloat(item.Product?.discount_price || 0)).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center px-1 mb-5">
                            <span className="text-sm text-gray-500 font-semibold">Total</span>
                            <span className="text-xl font-extrabold text-[#355872]">₹{calculateTotal().toFixed(2)}</span>
                        </div>

                        {/* Out-of-stock error */}
                        {checkoutError && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
                                <div className="flex items-center space-x-2 mb-1.5">
                                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-xs font-bold text-red-600">Some items are out of stock:</p>
                                </div>
                                <ul className="space-y-0.5 pl-6">
                                    {checkoutError.map((item, i) => (
                                        <li key={i} className="text-xs text-red-500 list-disc">{item.name}</li>
                                    ))}
                                </ul>
                                <p className="text-xs text-red-400 mt-2">Please remove or reduce the quantity of these items before placing your order.</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-3">
                            <button
                                onClick={() => { setCheckoutModal(false); setCheckoutError(null); }}
                                disabled={checkoutLoading}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCheckoutConfirm}
                                disabled={checkoutLoading || (checkoutError && checkoutError.length > 0)}
                                className="flex-1 py-2.5 rounded-xl bg-[#355872] hover:bg-[#274256] text-white text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {checkoutLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Checking stock...</span>
                                    </>
                                ) : (
                                    <span>Place Order</span>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
                    {cartItems.length > 0 && (
                        <button
                            onClick={openClearModal}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                        >
                            <span>Empty Cart</span>
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <p className="text-center py-10 opacity-60">Your cart is empty.</p>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.product_id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-all border border-gray-200">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.Product?.image}
                                            alt={item.Product?.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {item.Product?.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">

                                        {/* Quantity */}
                                        <div className="flex items-center bg-white rounded-lg p-1 border border-gray-300 shadow-sm">
                                            <button
                                                onClick={() => handleDecrement(item.product_id)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md"
                                            >
                                                -
                                            </button>

                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleManualUpdate(item.product_id, e.target.value)}
                                                className="w-12 bg-transparent text-center font-bold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />

                                            <button
                                                onClick={() => handleIncrement(item.product_id)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="w-24 text-right">
                                            <span className="font-bold text-xl text-gray-900">
                                                ₹{(item.quantity * (item.Product?.discount_price || 0)).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Delete */}
                                        <button
                                            onClick={() => openDeleteModal(item.product_id)}
                                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                            <div>
                                <p className="text-gray-500">Subtotal</p>
                                <p className="text-4xl font-bold text-gray-900">
                                    ₹{calculateTotal().toFixed(2)}
                                </p>
                            </div>

                            <button
                                onClick={() => { setCheckoutModal(true); setCheckoutError(null); }}
                                className="bg-[#355872] hover:bg-[#4a799b] text-white px-8 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-md hover:shadow-lg">
                                Checkout Now
                            </button>
                        </div>
                    </>
                )}
            </div>
            {/* <Footer /> */}
        </>
    );
}
export default Cart;
