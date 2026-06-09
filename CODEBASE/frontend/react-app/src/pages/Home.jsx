

import { useSelector } from "react-redux";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
  lazy,
  useRef,
} from "react";
import banner1 from "../assets/images/banner1.png";
import banner2 from "../assets/images/banner2.png";
import banner3 from "../assets/images/banner3.png";
import banner4 from "../assets/images/banner4.png";
import { useNavigate } from "react-router-dom";
import { productService } from "../services/productServices";
import { categoryService } from "../services/categoryServices";
import { cartService } from "../services/cartServices"; // <-- Added cartService import
import { debounce } from "../utils/debounce";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { wishlistService } from "../services/wishlistServices";
import { authService } from "../services/authServices";
import { API_BASE_URL } from "../config";
// Lazy Loaded Components
const Card = lazy(() => import("../components/Card"));
const CategoryBar = lazy(() => import("../components/CategoryBar"));
const StaticCategorySection = lazy(
  () => import("../components/StaticCategorySection"),
);

export default function HomePage() {
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.auth.user);
  console.log("reduxuser:", reduxUser)
  // --- STATES ---
  const [currentUser, setCurrentUser] = useState(null);
  const [cartTotal, setCartTotal] = useState(0); // <-- NEW: State for the cart badge number
  const [wishlistProductIds, setWishlistProductIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loadingDynamic, setLoadingDynamic] = useState(true);
  const [loadingStatic, setLoadingStatic] = useState(true);
  const [activeCategory, setActiveCategory] = useState({
    ID: 0,
    categoryname: "Sigvanta's Top Picks",
  });
  const [dynamicProducts, setDynamicProducts] = useState([]);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- DROPDOWN STATES & LOGIC ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // --- BANNER CAROUSEL LOGIC (INFINITE LOOP) ---
  const banners = useMemo(() => [banner1, banner2, banner3, banner4], []);
  const extendedBanners = useMemo(
    () => [banners[banners.length - 1], ...banners, banners[0]],
    [banners],
  );

  const [currentBanner, setCurrentBanner] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const nextSlide = useCallback(() => {
    // Edge Guard: If heading to final clone, ignore rapid clicks
    if (currentBanner >= extendedBanners.length - 1) return;
    setIsTransitioning(true);
    setCurrentBanner((prev) => prev + 1);
  }, [currentBanner, extendedBanners.length]);

  const prevSlide = useCallback(() => {
    // Edge Guard: If heading to first clone, ignore rapid clicks
    if (currentBanner <= 0) return;
    setIsTransitioning(true);
    setCurrentBanner((prev) => prev - 1);
  }, [currentBanner]);

  // Invisible Snap
  const handleTransitionEnd = useCallback(() => {
    if (currentBanner === 0) {
      setIsTransitioning(false);
      setCurrentBanner(banners.length);
    } else if (currentBanner === extendedBanners.length - 1) {
      setIsTransitioning(false);
      setCurrentBanner(1);
    }
  }, [currentBanner, banners.length, extendedBanners.length]);

  // Auto-play timer (resets on manual click!)
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(timer);
  }, [nextSlide, currentBanner]);

  // --- OPTIMIZED HANDLERS ---
  const handleSeeAllClick = useCallback(
    (name) => {
      navigate(`/category/${encodeURIComponent(name)}`, {
        state: {
          userid: currentUser?.id,
        },
      });
    },
    [navigate, currentUser?.id],
  );

  const handleAllProductsClick = useCallback(() => {
    navigate("/products", {
      state: {
        userid: currentUser?.id,
      },
    });
  }, [navigate, currentUser?.id]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setIsSearching(false);
    setSearchResults([]);
  }, []);

  const performSearch = useCallback(
    async (value) => {
      if (!value.trim()) {
        clearSearch();
        return;
      }
      setSearchLoading(true);
      setIsSearching(true);
      try {
        const response = await productService.getProducts(
          `search=${encodeURIComponent(value)}`,
        );
        setSearchResults(response.data || []);
      } catch (error) {
        console.error("searching error: ", error + String(loadingStatic));
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [clearSearch, loadingStatic],
  );

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 500),
    [performSearch],
  );

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      if (!value.trim()) setIsSearching(false);
      else debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleCategoryClick = useCallback(
    async (category) => {
      if (isSearching) clearSearch();
      if (category.ID === -1) {
        handleAllProductsClick();
        return;
      }

      if ([1, 2, 3, 4, 5].includes(category.ID)) {
        document
          .getElementById(`category-${category.ID}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (activeCategory.ID === category.ID) return;

      setActiveCategory(category);
      setLoadingDynamic(true);
      try {
        if (category.ID === 0) {
          setDynamicProducts(topPicks);
        } else {
          const res = await productService.getProducts(
            `categoryname=${encodeURIComponent(category.categoryname)}&limit=5`,
          );
          setDynamicProducts(res.data || []);
        }
      } catch (error) {
        console.error("dynamic category display error:", error);
        setDynamicProducts([]);
      } finally {
        setLoadingDynamic(false);
      }
    },
    [
      activeCategory.ID,
      isSearching,
      clearSearch,
      topPicks,
      handleAllProductsClick,
    ],
  );

  // --- USER & CART DATA FETCHING ---

  // NEW: Logic to fetch the total items in the cart
  const fetchCartTotal = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const cartData = await cartService.getCart(currentUser.id);
      const items = cartData.data || cartData || [];
      console.log(items);
      // Calculate total quantity by summing the quantity of each individual item
      const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartTotal(total);
    } catch (error) {
      console.error("Failed to fetch cart total:", error);
    }
  }, [currentUser?.id]);

  // NEW: Fetch wishlist and extract just the IDs for easy checking
  const fetchWishlist = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const wishlistData = await wishlistService.getWishlist(currentUser.id);
      // Create an array of just the product IDs: [1, 5, 12, etc...]
      const ids = wishlistData.map((item) => item.product_id);
      setWishlistProductIds(ids);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    setCurrentUser(reduxUser);
  }, [reduxUser]);

  // NEW: Fetch cart total whenever currentUser is established
  useEffect(() => {
    if (currentUser?.id) {
      fetchCartTotal();
      fetchWishlist(); // <-- ADD THIS
    }
  }, [currentUser?.id, fetchCartTotal, fetchWishlist]); // <-- UPDATE DEPENDENCIES

  // --- HOMEPAGE DATA FETCHING ---
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const fetchedCategories =
          await categoryService.getAllCategoriesforproducts();
        const fullCategoryList = [
          {
            ID: 0,
            categoryname: "Sigvanta's Top Picks",
            createdAt: new Date().toISOString(),
          },
          {
            ID: -1,
            categoryname: "All Products",
            createdAt: new Date().toISOString(),
          },
          ...fetchedCategories,
        ];
        setCategories(fullCategoryList);
        console.log("categories", fetchedCategories);
        const topPicksResponse = await productService.getProducts(
          "sort=-rating&limit=6",
        );
        const picks = Array.isArray(topPicksResponse.data)
          ? topPicksResponse.data.slice(1, 6)
          : [];

        setTopPicks(picks);
        setDynamicProducts(picks);
        setLoadingDynamic(false);

        const firstFive = fetchedCategories.slice(0, 5);
        const categoryPromises = firstFive.map((cat) =>
          productService.getProducts(`categoryID=${cat.ID}&limit=5`),
        );
        const categoryResponses = await Promise.all(categoryPromises);

        const productsMap = {};
        firstFive.forEach((cat, index) => {
          productsMap[cat.ID] = categoryResponses[index].data || [];
        });
        setCategoryProducts(productsMap);
        setLoadingStatic(false);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchHomepageData();
  }, []);

  const staticSections = useMemo(() => {
    return categories.filter((c) => c.ID > 0).slice(0, 5);
  }, [categories]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login"); // adjust to your login route
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  const profilePicture =
    currentUser?.profilePicture ||
    `${API_BASE_URL}/avatars/${currentUser?.ProfileIcon || "boy.png"}`;

  return (
    <div className="animate-fade-in min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#355872]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-violet-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-sky-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex-grow relative z-10">
        <header className="flex items-center justify-between px-8 py-4 backdrop-filter backdrop-blur-xl bg-white/40 shadow-sm border-b border-white/50 sticky top-0 z-50">
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 bg-[#355872] rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
              Sigvanta
            </span>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="backdrop-filter backdrop-blur-md bg-white/50 p-1 pl-4 rounded-2xl flex items-center shadow-sm border border-white/60 focus-within:border-[#355872] transition-all">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-transparent border-none outline-none text-slate-800 px-4 py-2 font-medium"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="pr-4 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <button
              onClick={() =>
                navigate("/user/wishlist", {
                  state: { userid: currentUser?.id },
                })
              }
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

            <button
              onClick={() =>
                navigate("/user/cart", {
                  state: {
                    userid: currentUser?.id,
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

            {/* Profile Dropdown Container */}
            {/* Profile Dropdown Container */}
            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2.5 bg-[#355872]/10 rounded-full border border-[#355872]/20 text-[#355872] hover:bg-[#355872] hover:text-white transition-all shadow-sm active:scale-95"
              >
                {currentUser ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
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
                )}
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
                {!currentUser && (
                  <Link to="/login" onClick={() => setIsDropdownOpen(false)}>
                    <div className="w-full text-sm font-bold text-[#355872] hover:text-white hover:bg-[#355872] py-1.5 px-3 rounded-xl border border-[#355872]/30 transition-colors text-center mb-2">
                      Login
                    </div>
                  </Link>
                )}

                {currentUser?.role === 'user' && <Link to='/user/orders'>
                  <button className="w-full text-left text-sm font-bold text-slate-700 hover:text-[#355872] py-1 transition-colors">
                    Order History
                  </button>
                </Link>}
                {currentUser?.role === 'admin' && <Link to="/admin/profile">
                  <div className="w-full text-left text-sm font-bold text-slate-700 hover:text-[#355872] py-1 mt-2 transition-colors">
                    Profile
                  </div>
                </Link>}
                {currentUser?.role === 'user' && <Link to="/user/profile">
                  <div className="w-full text-left text-sm font-bold text-slate-700 hover:text-[#355872] py-1 mt-2 transition-colors">
                    Profile
                  </div>
                </Link>}

                {currentUser && <button onClick={handleLogout}
                  className="w-full text-left text-sm font-bold text-rose-500 hover:text-rose-600 py-1 mt-2 transition-colors"
                >
                  Logout
                </button>
                }
              </div>
            </div>


          </div>
        </header>

        <main className="pb-16">
          <Suspense
            fallback={
              <div className="text-center p-20 text-slate-500 font-bold animate-pulse">
                Sigvanta is loading...
              </div>
            }
          >
            {isSearching ? (
              <section className="max-w-7xl mx-auto mt-12 px-8 min-h-[60vh] animate-fade-in">
                <h2 className="text-3xl font-black mb-8 text-slate-800">
                  Results for "{searchTerm}"
                </h2>
                {searchLoading ? (
                  <div className="animate-spin w-10 h-10 border-4 border-[#355872] border-t-transparent rounded-full mx-auto" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {/* NEW: Passed userId and onCartUpdate to search result cards */}

                    {searchResults.map((product) => (
                      <Card
                        key={product.ID}
                        {...product}
                        category={
                          categories.find((c) => c.ID === product.categoryID)
                            ?.categoryname
                        }
                        userId={currentUser?.id}
                        onCartUpdate={fetchCartTotal}
                        initialWishlist={wishlistProductIds.includes(
                          product.ID,
                        )}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <>
                {/* --- ANIMATED BANNER CAROUSEL --- */}
                <section
                  id="banner"
                  className="max-w-[6912px] mx-auto mt-8 px-8"
                >
                  <div className="relative w-[70%] mx-auto h-[250px] sm:h-[300px] md:h-[400px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl group">
                    {/* --- THE INFINITE SLIDING TRACK --- */}
                    <div
                      className={`flex w-full h-full ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
                      style={{
                        transform: `translateX(-${currentBanner * 100}%)`,
                      }}
                      onTransitionEnd={handleTransitionEnd}
                    >
                      {extendedBanners.map((banner, index) => (
                        <div
                          key={index}
                          className="w-full h-full shrink-0 relative"
                        >
                          <img
                            src={banner}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-60 mix-blend-screen"
                          />
                          <img
                            src={banner}
                            alt={`Promotional Banner`}
                            className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Left Arrow Button */}
                    <button
                      onClick={prevSlide}
                      className="absolute left-5 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-800/20 text-white hover:bg-slate-800/50 backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Right Arrow Button */}
                    <button
                      onClick={nextSlide}
                      className="absolute right-5 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-800/20 text-white hover:bg-slate-800/50 backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </section>
                <CategoryBar
                  categories={categories}
                  activeCategoryID={activeCategory.ID}
                  onCategoryClick={handleCategoryClick}
                />

                <section className="max-w-7xl mx-auto mt-4 px-8">
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center">
                    {activeCategory.ID === 0 && (
                      <span className="mr-3 text-[#355872]">★</span>
                    )}
                    {activeCategory.categoryname}
                  </h2>

                  {loadingDynamic ? (
                    <div className="flex justify-center py-10">
                      <div className="w-8 h-8 border-4 border-t-[#355872] rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {/* NEW: Passed userId and onCartUpdate to dynamic products */}
                        {dynamicProducts.map((p) => {
                          const matchedCategory = categories.find(
                            (c) => c.ID === p.categoryID,
                          );
                          return (
                            <Card
                              key={p.ID}
                              {...p}
                              category={
                                matchedCategory?.categoryname || "Uncategorized"
                              }
                              userId={currentUser?.id}
                              onCartUpdate={fetchCartTotal}
                              initialWishlist={wishlistProductIds.includes(
                                p.ID,
                              )}
                            />
                          );
                        })}
                      </div>
                      {activeCategory.ID !== 0 && (
                        <div className="mt-8 flex justify-center">
                          <button
                            onClick={() =>
                              handleSeeAllClick(activeCategory.categoryname)
                            }
                            className="px-6 py-2.5 bg-white/40 text-slate-700 font-semibold rounded-xl border border-white/60 hover:text-[#355872] hover:bg-white transition-all active:scale-95"
                          >
                            See all {activeCategory.categoryname} products
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </section>

                {/* NEW: Passed userId and onCartUpdate through to the StaticCategorySection */}
                {staticSections.map((category) => (
                  <StaticCategorySection
                    key={category.ID}
                    category={category}
                    products={categoryProducts[category.ID]}
                    onSeeAll={handleSeeAllClick}
                    userId={currentUser?.id}
                    onCartUpdate={fetchCartTotal}
                    wishlistProductIds={wishlistProductIds}
                  />
                ))}
              </>
            )}
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  );
}
