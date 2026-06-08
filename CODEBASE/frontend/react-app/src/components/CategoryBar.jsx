import React from "react";

const CategoryBar = React.memo(({ categories, activeCategoryID, onCategoryClick }) => (
  <section className="max-w-7xl mx-auto mt-8 px-8">
    <div className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar">
      {categories.map((category) => (
        <button
          key={category.ID}
          onClick={() => onCategoryClick(category)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
            activeCategoryID === category.ID 
              ? "bg-[#355872] text-white shadow-md" 
              : "bg-white/40 border border-white/60 text-slate-700 hover:bg-white/80"
          }`}
        >
          {category.categoryname}
        </button>
      ))}
    </div>
  </section>
));

export default CategoryBar;