import React from "react";
import Card from "./Card";

// Notice we added userId and onCartUpdate to the props list here!
const StaticCategorySection = React.memo(({ category, products, onSeeAll, userId, onCartUpdate, wishlistProductIds = [] }) => {
  if (!products || products.length === 0) return null;

  return (
    <section id={`category-${category.ID}`} className="max-w-7xl mx-auto mt-16 px-8 scroll-mt-24">
      <h2 className="text-2xl font-extrabold text-slate-800 mb-6 capitalize">{category.categoryname}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.map((p) => (
          <Card
            key={p.ID}
            {...p}
            category={category.categoryname}
            userId={userId}
            onCartUpdate={onCartUpdate}
            initialWishlist={wishlistProductIds.includes(p.ID)}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => onSeeAll(category.categoryname)}
          className="px-6 py-2.5 bg-white/40 text-slate-700 font-semibold rounded-xl border border-white/60 hover:text-[#355872] transition-all active:scale-95"
        >
          See all {category.categoryname} products
        </button>
      </div>
    </section>
  );
});

export default StaticCategorySection;