import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "../components/Card";
import { productService } from "../services/productServices";
import { cartService } from "../services/cartServices";
import { wishlistService } from "../services/wishlistServices";
import { debounce } from "../utils/debounce";
import Footer from "../components/Footer";
export default function CategoryProducts() {
  const { categoryname } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // const user=useSelector((state)=>state.user)
  const userid = location.state?.userid;
  const [cartTotal, setCartTotal] = useState(0);
  const [wishlistProductIds, setWishlistProductIds] = useState([]);

  const fetchCartTotal = useCallback(async () => {
    if (!userid) return;
    try {
      const cartData = await cartService.getCart(userid);
      const items = cartData.data || cartData || [];
      console.log("items:", items);
      // Calculate total quantity by summing the quantity of each individual item
      const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartTotal(total);
    } catch (error) {
      console.error("Failed to fetch cart total:", error);
    }
  }, [userid]);

  const fetchWishlist = useCallback(async () => {
    if (!userid) return;
    try {
      const wishlistData = await wishlistService.getWishlist(userid);
      const ids = wishlistData.map((item) => item.product_id);
      setWishlistProductIds(ids);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }, [userid]);
  useEffect(() => {
    if (userid) {
      fetchCartTotal();
      fetchWishlist(); // <-- Call the new function
    }
  }, [userid, fetchCartTotal, fetchWishlist]);
  // --- DATA STATES ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOptions, setSortOptions] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(5);

  const priceCap = 150000;

  // --- 1. CORE FILTER LOGIC ---
  const applyFilters = useCallback(
    async (search, sorts, minP, maxP, minR, maxR, page = 1) => {
      setLoading(true);
      try {
        let queryParts = [
          `categoryname=${encodeURIComponent(categoryname)}`,
          `limit=${ITEMS_PER_PAGE}`,
          `page=${page}`,
        ];

        if (search) queryParts.push(`search=${encodeURIComponent(search)}`);
        if (sorts.length > 0) queryParts.push(`sort=${sorts.join(",")}`);

        // --- FIX 1: ALWAYS SEND BOTH BOUNDS IF SLIDER IS TOUCHED ---
        if (minP > 0 || maxP < priceCap) {
          queryParts.push(`discount_price[gte]=${minP}`);
          queryParts.push(`discount_price[lte]=${maxP}`);
        }

        if (minR > 0) {
          queryParts.push(`rating[gte]=${minR}`);
          queryParts.push(`rating[lt]=${maxR}`);
        }

        const res = await productService.getProducts(queryParts.join("&"));

        const productsData = res.data || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
        setTotalPages(res.num_pages || 1);
        setCurrentPage(page);
      } catch (error) {
        console.error("error on fetching products:", error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [categoryname],
  );

  const debouncedApplyFilters = useMemo(
    () => debounce(applyFilters, 500),
    [applyFilters],
  );

  useEffect(() => {
    applyFilters("", [], 0, 150000, 0, 5, 1);
  }, [categoryname, applyFilters]);

  // --- 2. HANDLERS ---
  const handleReset = () => {
    setSearchTerm("");
    setSortOptions([]);
    setMinPrice(0);
    setMaxPrice(150000);
    setMinRating(0);
    setMaxRating(5);
    applyFilters("", [], 0, 150000, 0, 5, 1);
  };

  const handleSortToggle = (option) => {
    setSortOptions((prev) => {
      // --- FIX 2: MAKE SORTS MUTUALLY EXCLUSIVE ---
      // If clicking the one that's already active, turn it off
      if (prev.includes(option)) {
        const next = [];
        applyFilters(
          searchTerm,
          next,
          minPrice,
          maxPrice,
          minRating,
          maxRating,
          1,
        );
        return next;
      }
      // Otherwise, make this the ONLY active sort option
      else {
        const next = [option];
        applyFilters(
          searchTerm,
          next,
          minPrice,
          maxPrice,
          minRating,
          maxRating,
          1,
        );
        return next;
      }
    });
  };

  const handleRatingToggle = (star) => {
    const newMin = minRating === star ? 0 : star;
    const newMax = minRating === star ? 5 : star + 1;
    setMinRating(newMin);
    setMaxRating(newMax);
    applyFilters(
      searchTerm,
      sortOptions,
      minPrice,
      maxPrice,
      newMin,
      newMax,
      1,
    );
  };

  const handlePriceChange = (e, type) => {
    const val = Number(e.target.value);
    let newMin = minPrice;
    let newMax = maxPrice;
    if (type === "min") {
      newMin = Math.min(val, maxPrice - 1000);
      setMinPrice(newMin);
    } else {
      newMax = Math.max(val, minPrice + 1000);
      setMaxPrice(newMax);
    }
    debouncedApplyFilters(
      searchTerm,
      sortOptions,
      newMin,
      newMax,
      minRating,
      maxRating,
      1,
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      applyFilters(
        searchTerm,
        sortOptions,
        minPrice,
        maxPrice,
        minRating,
        maxRating,
        newPage,
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="animate-fade-in min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#355872]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-violet-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-sky-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* FOREGROUND WRAPPER (Notice the bg-white/40 to let blobs show through) */}
      <div className="flex-grow flex flex-col">
        {/* HEADER */}
        <header className="px-8 py-4 backdrop-filter backdrop-blur-xl bg-white/70 border-b border-white/50 sticky top-0 z-50 flex items-center justify-between">
          <div
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-[#355872] rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">
              Sigvanta
            </span>
          </div>

          <div className="flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder={`Search ${categoryname}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                debouncedApplyFilters(
                  e.target.value,
                  sortOptions,
                  minPrice,
                  maxPrice,
                  minRating,
                  maxRating,
                  1,
                );
              }}
              className="w-full bg-white/80 border border-slate-200 rounded-2xl px-5 py-2.5 text-sm focus:border-[#355872] focus:ring-1 focus:ring-[#355872]/20 outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  applyFilters(
                    "",
                    sortOptions,
                    minPrice,
                    maxPrice,
                    minRating,
                    maxRating,
                    1,
                  );
                }}
                className="absolute right-4 top-2.5 text-slate-400 font-bold text-sm hover:text-rose-500 transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                navigate("/user/wishlist", { state: { userid: userid } })
              }
              className="p-2.5 bg-white/80 border border-slate-200 rounded-full text-slate-600 hover:text-rose-500 transition-all shadow-sm"
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
            <button
              onClick={() =>
                navigate("/user/cart", {
                  state: {
                    userid: userid,
                  },
                })
              }
              className="p-2.5 bg-white/50 rounded-full border border-white/60 text-slate-600 hover:text-[#355872] hover:bg-white transition-all shadow-sm active:scale-95 relative group"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* NEW: Render the cart total dynamically */}
              {cartTotal > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#355872] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartTotal}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR (Added bg-white/80 backdrop-blur-sm) */}
          <aside className="space-y-5 h-fit lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            <button
              onClick={handleReset}
              className="w-full py-3 bg-white/80 backdrop-blur-sm text-rose-600 text-xs font-black uppercase tracking-widest rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors shadow-sm"
            >
              Reset All Filters
            </button>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
                Sort By
              </h3>
              <div className="flex flex-col space-y-2">
                {[
                  { id: "-rating", label: "Top Rated" },
                  { id: "discount_price", label: "Price: Low to High" },
                  { id: "-discount_price", label: "Price: High to Low" },
                  { id: "name", label: "Alphabetical: A to Z" },
                  { id: "-name", label: "Alphabetical: Z to A" },
                  { id: "-discount", label: "Biggest Discounts" },
                ].map((opt) => {
                  const isActive = sortOptions.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSortToggle(opt.id)}
                      className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive ? "bg-[#355872] text-white shadow-lg" : "bg-white/80 border border-slate-200 text-slate-600 hover:border-[#355872]"}`}
                    >
                      {opt.label}
                      {isActive && <span className="float-right">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">
                Price Range
              </h3>
              <div className="relative h-1 bg-slate-200 rounded-full mb-8">
                <div
                  className="absolute h-full bg-[#355872]"
                  style={{
                    left: `${(minPrice / priceCap) * 100}%`,
                    right: `${100 - (maxPrice / priceCap) * 100}%`,
                  }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max={priceCap}
                  value={minPrice}
                  onChange={(e) => handlePriceChange(e, "min")}
                  className="absolute w-full top-[-6px] pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#355872]"
                />
                <input
                  type="range"
                  min="0"
                  max={priceCap}
                  value={maxPrice}
                  onChange={(e) => handlePriceChange(e, "max")}
                  className="absolute w-full top-[-6px] pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#355872]"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-center text-xs font-bold text-slate-700">
                  ₹{minPrice.toLocaleString()}
                </div>
                <span className="text-slate-300">—</span>
                <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-center text-xs font-bold text-slate-700">
                  ₹{maxPrice.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
                Rating
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingToggle(star)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${minRating === star ? "bg-amber-500 border-amber-500 text-white shadow-md" : "bg-white border-slate-200 text-slate-400"}`}
                  >
                    {star}★
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* PRODUCTS GRID SECTION */}
          <section className="lg:col-span-3 flex flex-col">
            <div className="flex items-baseline justify-between mb-4">
              <h1 className="text-3xl font-black text-slate-900 capitalize tracking-tight">
                {categoryname}
              </h1>
              <p className="text-xs font-bold text-slate-400">
                Page {currentPage} of {totalPages} ({products.length} Items
                Found)
              </p>
            </div>

            {/* TOP PAGINATION */}
            {!loading && totalPages > 1 && (
              <div className="mb-6 flex justify-end items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white/80 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors backdrop-blur-sm"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    totalPages > 5 &&
                    (pageNum < currentPage - 2 || pageNum > currentPage + 2)
                  ) {
                    if (pageNum === 1 || pageNum === totalPages)
                      return (
                        <span
                          key={pageNum}
                          className="px-1 text-slate-400 text-xs"
                        >
                          ...
                        </span>
                      );
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all backdrop-blur-sm ${currentPage === pageNum
                        ? "bg-[#355872] border-[#355872] text-white shadow-md"
                        : "bg-white/80 border-slate-200 text-slate-600 hover:border-[#355872] hover:text-[#355872]"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white/80 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors backdrop-blur-sm"
                >
                  Next
                </button>
              </div>
            )}

            {/* PRODUCTS */}
            {loading ? (
              <div className="flex justify-center py-20 flex-grow">
                <div className="w-10 h-10 border-4 border-t-[#355872] border-slate-200 rounded-full animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 flex-grow">
                <p className="text-slate-400 font-bold">
                  No items match your filters.
                </p>
              </div>
            ) : (
              <div className="flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                  {products.map((product) => (
                    <Card
                      key={product.ID}
                      {...product}
                      userId={userid}
                      initialWishlist={wishlistProductIds.includes(product.ID)}
                      onCartUpdate={fetchCartTotal}
                      category={categoryname}
                      isDiscountView={sortOptions.includes("-discount")}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>

        {/* FOOTER PLACEMENT */}
        <Footer />
      </div>
    </div>
  );
}
