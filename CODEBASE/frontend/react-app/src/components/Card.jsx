// import React, { useState } from "react";

// export default function Card({
//   name,
//   image,
//   actual_price,
//   discount_price,
//   rating,
//   description,
//   category,
// }) {
//   const [quantity, setQuantity] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isEditingQty, setIsEditingQty] = useState(false);
//   const [qtyInput, setQtyInput] = useState("");

//   const handleAddToCart = () => setQuantity(1);
//   const handleIncrease = () => setQuantity((prev) => prev + 1);
//   const handleDecrease = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

//   const handleNumberClick = () => {
//     setQtyInput(quantity.toString());
//     setIsEditingQty(true);
//   };

//   const handleQtySubmit = () => {
//     if (!isEditingQty) return;
//     const num = Number(qtyInput);
//     if (isNaN(num) || num < 0 || qtyInput.trim() === "" || !Number.isInteger(num)) {
//       alert("invalid number");
//     } else {
//       setQuantity(num);
//     }
//     setIsEditingQty(false);
//   };

//   return (
//     <>
//       {/* --- MAIN CARD (Forced backdrop-filter and clearer bg-white/40) --- */}
//       <div className="max-w-[290px] w-full mx-auto backdrop-filter backdrop-blur-xl bg-white/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-white/60 flex flex-col h-full group">

//         {/* Top Image Section */}
//         <div className="relative h-56 w-full flex items-center justify-center p-4 shrink-0 overflow-hidden">
//           <img
//             src={image}
//             alt={name}
//             className="max-w-full max-h-full object-contain mix-blend-multiply"
//           />
//         </div>

//         {/* Content Section */}
//         <div className="p-5 flex flex-col flex-grow bg-transparent border-t border-white/40">
//           <div className="flex justify-between items-center mb-3">
//             <span className="text-[#355872] text-[9px] font-extrabold uppercase tracking-widest backdrop-filter backdrop-blur-md bg-[#355872]/10 border border-white/40 px-2.5 py-1 rounded-lg">
//               {category || "Category"}
//             </span>

//             {rating && (
//               <div className="flex items-center backdrop-filter backdrop-blur-md bg-white/50 border border-white/50 shadow-sm px-2 py-0.5 rounded-lg">
//                 <span className="text-[10px] font-bold text-slate-800 mr-1">
//                   {rating}
//                 </span>
//                 <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//               </div>
//             )}
//           </div>

//           <h2 className="text-sm font-extrabold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#355872] transition-colors duration-300">
//             {name}
//           </h2>

//           <div className="mt-2 mb-4 flex-grow">
//             <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
//               {description}
//             </p>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="font-bold text-[10px] mt-1.5 text-slate-500 hover:text-[#355872] underline focus:outline-none tracking-wide transition-colors"
//             >
//               View details
//             </button>
//           </div>

//           <div className="mt-auto">
//             <div className="flex flex-col mb-3">
//               <span className="text-slate-500 line-through text-[11px] font-medium leading-none mb-1">
//                 ₹{actual_price}
//               </span>
//               <span className="text-xl font-black text-slate-900 leading-none">
//                 ₹{discount_price}
//               </span>
//             </div>

//             <div className="flex items-center space-x-2 h-10">
//               <button
//                 onClick={() => setIsWishlisted(!isWishlisted)}
//                 className={`flex-shrink-0 w-10 h-full border rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 ${isWishlisted
//                   ? "border-rose-300 bg-rose-100 text-rose-600"
//                   : "border-white/60 bg-white/40 hover:border-rose-300 hover:bg-rose-100 text-slate-500 hover:text-rose-600"
//                   }`}
//               >
//                 <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//               </button>

//               <div className="flex-1 h-full">
//                 {quantity === 0 ? (
//                   <button
//                     onClick={handleAddToCart}
//                     className="w-full h-full bg-[#355872] hover:bg-[#274256] text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center active:scale-95"
//                   >
//                     Add to cart
//                   </button>
//                 ) : (
//                   <div className="w-full h-full bg-[#355872] text-white font-bold rounded-xl flex justify-between items-center px-1.5 shadow-sm transition-colors duration-300">
//                     <button onClick={handleDecrease} className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors active:scale-95">
//                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
//                     </button>

//                     {isEditingQty ? (
//                       <input
//                         type="text"
//                         value={qtyInput}
//                         autoFocus
//                         onChange={(e) => setQtyInput(e.target.value)}
//                         onBlur={handleQtySubmit}
//                         onKeyDown={(e) => e.key === "Enter" && handleQtySubmit()}
//                         className="w-6 text-sm text-center bg-transparent text-white font-bold outline-none border-b border-white/50 focus:ring-0"
//                       />
//                     ) : (
//                       <span onClick={handleNumberClick} className="text-sm w-6 text-center cursor-pointer hover:underline" title="Click to edit quantity">
//                         {quantity}
//                       </span>
//                     )}

//                     <button onClick={handleIncrease} className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors active:scale-95">
//                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- QUICK VIEW MODAL --- */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6"
//           onClick={() => setIsModalOpen(false)}
//         >
//           <div
//             className="backdrop-filter backdrop-blur-2xl bg-white/80 rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full flex flex-col md:flex-row relative animate-fade-in-up border border-white/60"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-4 right-4 z-10 backdrop-filter backdrop-blur-md bg-white/60 text-slate-700 p-2.5 rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-sm border border-white/60 active:scale-95"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             {/* Modal Image Section */}
//             <div className="relative md:w-1/2 p-8 flex items-center justify-center min-h-[300px] border-b md:border-b-0 md:border-r border-white/40">
//               <img
//                 src={image}
//                 alt={name}
//                 className="max-w-full max-h-full object-contain mix-blend-multiply"
//               />
//             </div>

//             <div className="p-8 md:w-1/2 flex flex-col justify-center bg-transparent">
//               <span className="text-[#355872] text-[10px] font-extrabold uppercase tracking-widest backdrop-filter backdrop-blur-md bg-[#355872]/10 border border-white/40 px-3 py-1.5 rounded-lg w-fit mb-3">
//                 {category || "Category"}
//               </span>
//               <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-3">
//                 {name}
//               </h2>

//               {rating && (
//                 <div className="flex items-center mb-4">
//                   <span className="text-sm font-bold text-slate-800 mr-2">
//                     {rating}
//                   </span>
//                   <div className="flex text-amber-500">
//                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   </div>
//                 </div>
//               )}

//               <p className="text-slate-600 text-sm leading-relaxed mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
//                 {description}
//               </p>

//               <div className="flex justify-between items-end mt-auto pt-5 border-t border-white/40">
//                 <div className="flex flex-col">
//                   <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">
//                     Price
//                   </span>
//                   <div className="flex flex-col">
//                     <span className="text-slate-500 line-through text-sm font-medium leading-none mb-1">
//                       ₹{actual_price}
//                     </span>
//                     <span className="text-3xl font-black text-slate-900 leading-none">
//                       ₹{discount_price}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="h-12 w-36">
//                   {quantity === 0 ? (
//                     <button
//                       onClick={handleAddToCart}
//                       className="w-full h-full bg-[#355872] hover:bg-[#274256] text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md flex items-center justify-center active:scale-95"
//                     >
//                       Add to cart
//                     </button>
//                   ) : (
//                     <div className="w-full h-full bg-[#355872] text-white font-bold rounded-xl flex justify-between items-center px-2 shadow-md transition-all duration-300">
//                       <button onClick={handleDecrease} className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors active:scale-95">
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
//                       </button>

//                       {isEditingQty ? (
//                         <input
//                           type="text"
//                           value={qtyInput}
//                           autoFocus
//                           onChange={(e) => setQtyInput(e.target.value)}
//                           onBlur={handleQtySubmit}
//                           onKeyDown={(e) => e.key === "Enter" && handleQtySubmit()}
//                           className="w-8 text-lg text-center bg-transparent text-white font-bold outline-none border-b border-white/50 focus:ring-0"
//                         />
//                       ) : (
//                         <span onClick={handleNumberClick} className="text-lg w-8 text-center cursor-pointer hover:underline" title="Click to edit quantity">
//                           {quantity}
//                         </span>
//                       )}

//                       <button onClick={handleIncrease} className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors active:scale-95">
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }




import React, { useState, useEffect } from "react";
import { cartService } from "../services/cartServices";
import { wishlistService } from "../services/wishlistServices"
export default function Card({
  ID,
  userId,
  onCartUpdate,
  name,
  image,
  actual_price,
  discount_price,
  rating,
  description,
  category,
  isDiscountView,// New prop to control badge visibility
  initialWishlist = false,
  onWishlistUpdate,
  onWishlistToggle,
}) {
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [qtyInput, setQtyInput] = useState("");
  const [inventoryAlert, setInventoryAlert] = useState({ isOpen: false, message: "" });
  const showInventoryAlert = (message) => setInventoryAlert({ isOpen: true, message });
  const closeInventoryAlert = () => setInventoryAlert({ isOpen: false, message: "" });

  // Logic to calculate discount percentage dynamically
  const discountPercent =
    actual_price && discount_price
      ? Math.round(
        ((parseFloat(actual_price) - parseFloat(discount_price)) /
          parseFloat(actual_price)) *
        100,
      )
      : 0;
  console.log("user id ------ >", userId)
  const handleAddToCart = async () => {
    if (!userId) return alert("Please log in to add items to your cart!");

    setQuantity(1); // Optimistic update
    try {
      await cartService.addToCart(userId, ID);
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      setQuantity(0); // Revert on failure
      const msg = error.response?.data?.message || "Could not add item to cart.";
      showInventoryAlert(msg);
    }
  };

  const handleIncrease = async () => {
    setQuantity((prev) => prev + 1); // Optimistic update
    try {
      await cartService.incrementItem(userId, ID);
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      setQuantity((prev) => prev - 1); // Revert on failure
      const msg = error.response?.data?.message || "Stock limit reached.";
      showInventoryAlert(msg);
    }
  };

  const handleDecrease = async () => {
    const prevQty = quantity;
    const newQty = prevQty > 0 ? prevQty - 1 : 0;
    setQuantity(newQty); // Optimistic update

    try {
      if (prevQty === 1) {
        await cartService.removeProduct(userId, ID);
      } else if (prevQty > 1) {
        await cartService.decrementItem(userId, ID);
      }
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error("error on using the subtraction button ", error);
      setQuantity(prevQty); // Revert on failure
    }
  };

  const handleNumberClick = () => {
    setQtyInput(quantity.toString());
    setIsEditingQty(true);
  };

  const handleWishlist = async () => {
    if (!userId) return alert("Please log in to add items to your wishlist!");
    try {
      if (isWishlisted) {
        // ✅ Optimistic update
        setIsWishlisted(false);

        await wishlistService.removeFromWishlist(userId, ID);

        // ✅ Inform parent
        if (onWishlistUpdate) onWishlistUpdate();
        if (onWishlistToggle) onWishlistToggle(ID, false);
      } else {
        // ✅ Optimistic update
        setIsWishlisted(true);

        await wishlistService.addToWishlist(userId, ID);

        if (onWishlistUpdate) onWishlistUpdate();
        if (onWishlistToggle) onWishlistToggle(ID, true);
      }
    } catch (error) {
      console.error("Wishlist error:", error);

      // ❌ Revert if failed
      setIsWishlisted((prev) => !prev);
    }
  };

  const handleQtySubmit = async () => {
    if (!isEditingQty) return;
    const num = Number(qtyInput);

    if (
      isNaN(num) ||
      num < 0 ||
      qtyInput.trim() === "" ||
      !Number.isInteger(num)
    ) {
      showInventoryAlert("Please enter a valid whole number.");
      setIsEditingQty(false);
      return;
    }

    const prevQty = quantity;
    setQuantity(num); // Optimistic update
    setIsEditingQty(false);

    try {
      if (num === 0 && prevQty > 0) {
        await cartService.removeProduct(userId, ID);
      } else if (num > 0) {
        await cartService.updateQuantity(userId, ID, num);
      }
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      setQuantity(prevQty); // Revert on failure
      const msg = error.response?.data?.message || "Stock limit reached.";
      showInventoryAlert(msg);
    }
  };
  useEffect(() => {
    setIsWishlisted(initialWishlist);
  }, [initialWishlist]);
  return (
    <>
      {/* --- INVENTORY ALERT MODAL --- */}
      {inventoryAlert.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Stock Limit Reached</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">{inventoryAlert.message}</p>
            <button
              onClick={closeInventoryAlert}
              className="w-full bg-[#355872] hover:bg-[#274256] text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN CARD --- */}
      <div className="relative max-w-[320px] w-full mx-auto bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200 flex flex-col h-full group">
        {/* --- RED DISCOUNT BADGE --- */}
        {/* Only displays if isDiscountView is true and there is a valid discount */}
        {isDiscountView && discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-20 bg-rose-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg animate-pulse">
            {discountPercent}% OFF
          </div>
        )}

        {/* Top Image Section */}
        <div className="relative h-48 w-full flex items-center justify-center p-4 shrink-0 overflow-hidden bg-white">
          <img
            src={image}
            alt={name}
            className="max-w-full max-h-full object-contain mix-blend-multiply "
          />
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow bg-white border-t border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#355872] text-[9px] font-extrabold uppercase tracking-widest bg-[#355872]/10 px-2.5 py-1 rounded-lg">
              {category || "category"}
            </span>

            {rating && (
              <div className="flex items-center bg-white border border-slate-200 shadow-sm px-2 py-0.5 rounded-lg">
                <span className="text-[10px] font-bold text-slate-800 mr-1">
                  {rating}
                </span>
                <svg
                  className="w-3 h-3 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-sm font-extrabold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#355872] transition-colors duration-300">
            {name}
          </h2>

          <div className="mt-1.5 mb-3 flex-grow">
            <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
              {description}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-bold text-[10px] mt-1.5 text-slate-400 hover:text-[#355872] underline focus:outline-none tracking-wide transition-colors"
            >
              View details
            </button>
          </div>

          <div className="mt-auto">
            <div className="flex flex-col mb-3">
              <span className="text-slate-400 line-through text-[11px] font-medium leading-none mb-1">
                ₹{actual_price}
              </span>
              <span className="text-xl font-black text-slate-800 leading-none">
                ₹{discount_price}
              </span>
            </div>

            <div className="flex items-center space-x-2 h-10">
              <button
                onClick={handleWishlist}
                className={`flex-shrink-0 w-10 h-full border rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 ${isWishlisted
                  ? "border-rose-200 bg-rose-50 text-rose-500"
                  : "border-slate-200 bg-slate-50 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-500"
                  }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isWishlisted ? "currentColor" : "none"}
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

              <div className="flex-1 h-full">
                {quantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full h-full bg-[#355872] hover:bg-[#274256] text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center active:scale-95"
                  >
                    Add to cart
                  </button>
                ) : (
                  <div className="w-full h-full bg-[#355872] text-white font-bold rounded-xl flex justify-between items-center px-1.5 shadow-sm transition-colors duration-300">
                    <button
                      onClick={handleDecrease}
                      className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors active:scale-95"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M20 12H4"
                        />
                      </svg>
                    </button>

                    {isEditingQty ? (
                      <input
                        type="text"
                        value={qtyInput}
                        autoFocus
                        onChange={(e) => setQtyInput(e.target.value)}
                        onBlur={handleQtySubmit}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleQtySubmit()
                        }
                        className="w-6 text-sm text-center bg-transparent text-white font-bold outline-none border-b border-white/50 focus:ring-0"
                      />
                    ) : (
                      <span
                        onClick={handleNumberClick}
                        className="text-sm w-6 text-center cursor-pointer hover:underline"
                        title="Click to edit quantity"
                      >
                        {quantity}
                      </span>
                    )}

                    <button
                      onClick={handleIncrease}
                      className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors active:scale-95"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- QUICK VIEW MODAL --- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full flex flex-col md:flex-row relative animate-fade-in-up border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Discount Badge */}
            {isDiscountView && discountPercent > 0 && (
              <div className="absolute top-6 left-6 z-20 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                {discountPercent}% SAVINGS
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-slate-100 text-slate-500 p-2.5 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-all shadow-sm active:scale-95"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Image Section */}
            <div className="relative md:w-1/2 p-8 flex items-center justify-center min-h-[300px] border-b md:border-b-0 md:border-r border-slate-100 bg-white">
              <img
                src={image}
                alt={name}
                className="max-w-full max-h-full object-contain mix-blend-multiply"
              />
            </div>

            <div className="p-8 md:w-1/2 flex flex-col justify-center bg-white">
              <span className="text-[#355872] text-[10px] font-extrabold uppercase tracking-widest bg-[#355872]/10 px-3 py-1.5 rounded-lg w-fit mb-3">
                {category || "Category"}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-3">
                {name}
              </h2>

              {rating && (
                <div className="flex items-center mb-4">
                  <span className="text-sm font-bold text-slate-800 mr-2">
                    {rating}
                  </span>
                  <div className="flex text-amber-500">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              )}

              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {description}
              </p>

              <div className="flex justify-between items-end mt-auto pt-5 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">
                    Price
                  </span>
                  <div className="flex flex-col">
                    <span className="text-slate-400 line-through text-sm font-medium leading-none mb-1">
                      ₹{actual_price}
                    </span>
                    <span className="text-3xl font-black text-slate-900 leading-none">
                      ₹{discount_price}
                    </span>
                  </div>
                </div>

                <div className="h-12 w-36">
                  {quantity === 0 ? (
                    <button
                      onClick={handleAddToCart}
                      className="w-full h-full bg-[#355872] hover:bg-[#274256] text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md flex items-center justify-center active:scale-95"
                    >
                      Add to cart
                    </button>
                  ) : (
                    <div className="w-full h-full bg-[#355872] text-white font-bold rounded-xl flex justify-between items-center px-2 shadow-md transition-all duration-300">
                      <button
                        onClick={handleDecrease}
                        className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors active:scale-95"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M20 12H4"
                          />
                        </svg>
                      </button>

                      {isEditingQty ? (
                        <input
                          type="text"
                          value={qtyInput}
                          autoFocus
                          onChange={(e) => setQtyInput(e.target.value)}
                          onBlur={handleQtySubmit}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleQtySubmit()
                          }
                          className="w-8 text-lg text-center bg-transparent text-white font-bold outline-none border-b border-white/50 focus:ring-0"
                        />
                      ) : (
                        <span
                          onClick={handleNumberClick}
                          className="text-lg w-8 text-center cursor-pointer hover:underline"
                          title="Click to edit quantity"
                        >
                          {quantity}
                        </span>
                      )}

                      <button
                        onClick={handleIncrease}
                        className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors active:scale-95"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
