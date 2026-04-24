"use client";

import { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import AddToCartButton from "../components/AddToCartButton";

const SUBCATEGORIES = [
  { id: "all", label: "All" },
  { id: "books-notebooks", label: "Books & Notebooks" },
  { id: "calculators", label: "Calculators" },
  { id: "drawing-materials", label: "Drawing Materials" },
  { id: "pens", label: "Pens" },
  { id: "files-folders", label: "Files & Folders" },
  { id: "btech-polytechnic", label: "BTech / Polytechnic" },
  { id: "xerox-printout", label: "Xerox / Printout" },
  { id: "jamia-school", label: "Jamia School" },
  { id: "other-stationery", label: "Other" },
];

export default function StationeryClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSub, setActiveSub] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products?category=stationery");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSub = activeSub === "all" || p.subcategory === activeSub;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return matchSub && matchSearch;
    });
  }, [products, activeSub, search]);

  return (
    <div className="min-h-screen bg-[#22323c] text-[#f5f5f5]">
      {/* Hero */}
      <div className="bg-[#1a2830] border-b border-white/5 pt-28 pb-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-400 text-xs font-black uppercase tracking-widest">✏️ Stationery Store</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            All <span className="text-blue-400">Stationery</span> Items
          </h1>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[60px] z-30 bg-[#22323c]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative sm:w-72">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#17d492]/40 text-xs pointer-events-none" />
            <input
              type="text"
              placeholder="Search stationery..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1a2830] border border-white/10
                focus:outline-none focus:border-blue-400 text-white placeholder:text-white/20 text-sm transition"
            />
          </div>

          {/* Subcategory pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-1">
            {SUBCATEGORIES.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition shrink-0 ${
                  activeSub === sub.id
                    ? "bg-blue-500 text-white"
                    : "bg-[#1a2830] text-slate-400 border border-white/10 hover:border-blue-400/40 hover:text-blue-300"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading && (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-28">
            <p className="text-5xl mb-4">✏️</p>
            <p className="text-white/30 font-bold text-lg">No products found</p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-3 text-blue-400 text-sm font-bold underline">
                Clear search
              </button>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p className="text-slate-500 text-sm font-bold mb-5">
              Showing <span className="text-blue-400">{filtered.length}</span> products
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((product) => (
                <StationeryCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Stationery Card ── */
function StationeryCard({ product }) {
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  console.log("hasVariants:", hasVariants, "variants:", product.variants);
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? 0 : null);
  const [imgIdx, setImgIdx] = useState(0);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const price = hasVariants
    ? Number(product.variants[selectedVariant]?.price || 0)
    : Number(product.price || 0);

  const mrp = hasVariants
    ? Number(product.variants[selectedVariant]?.mrp || 0)
    : Number(product.actualPrice || 0);

  const hasDiscount = mrp > price;
  const discountPct = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["/placeholder.png"];

  const cartProduct = hasVariants
    ? {
        ...product,
        price,
        actualPrice: mrp,
        title: `${product.title} – ${product.variants[selectedVariant]?.label}`,
      }
    : product;

  return (
    <div className="bg-[#1a2830] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-400/30 transition-all group flex flex-col">

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#22323c]">
        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">
            {discountPct}% OFF
          </span>
        )}
        <img
          src={images[imgIdx]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition ${
                  i === imgIdx ? "bg-blue-400" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">

        {/* Title */}
        <p className="text-sm font-black text-white line-clamp-2 mb-1">
          {product.title}
        </p>
        {product.unit && (
          <p className="text-xs text-slate-500 mb-2">{product.unit}</p>
        )}

        {/* Price row + Options button on same line */}
        <div className="flex items-center justify-between mb-2 mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-blue-400">₹{price}</span>
            {hasDiscount && (
              <>
                <span className="text-xs text-slate-500 line-through">₹{mrp}</span>
                <span className="text-xs text-red-400 font-bold">{discountPct}% off</span>
              </>
            )}
          </div>

          {/* Options toggle button — only shown when variants exist */}
          {hasVariants && (
            <button
              type="button"
              onClick={() => setOptionsOpen((prev) => !prev)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                optionsOpen
                  ? "border-blue-400 bg-blue-500/15 text-blue-300"
                  : "border-white/15 bg-[#22323c] text-slate-300 hover:border-blue-400/40 hover:text-blue-300"
              }`}
            >
              options
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: "transform 0.2s",
                  transform: optionsOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </div>

        {/* Expandable variant grid */}
        {hasVariants && optionsOpen && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {product.variants.map((v, i) => {
              const isSelected = selectedVariant === i;
              const vMrp = Number(v.mrp || 0);
              const vPrice = Number(v.price || 0);
              const vDiscount =
                vMrp > vPrice ? Math.round(((vMrp - vPrice) / vMrp) * 100) : 0;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedVariant(i)}
                  className={`relative flex flex-col items-start px-2.5 py-2 rounded-xl border text-left transition-all min-w-[64px] ${
                    isSelected
                      ? "border-blue-400 bg-blue-500/15 ring-1 ring-blue-400/40"
                      : "border-white/10 bg-[#22323c] hover:border-blue-400/40"
                  }`}
                >
                  <span className={`text-xs font-black leading-tight ${isSelected ? "text-white" : "text-slate-300"}`}>
                    {v.label}
                  </span>
                  <span className={`text-[11px] font-black mt-0.5 ${isSelected ? "text-blue-400" : "text-slate-400"}`}>
                    ₹{vPrice}
                  </span>
                  {vMrp > vPrice && (
                    <span className="text-[10px] text-slate-600 line-through leading-none">
                      ₹{vMrp}
                    </span>
                  )}
                  {vDiscount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-black px-1 py-0.5 rounded-full leading-none">
                      -{vDiscount}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Selected variant label */}
        {hasVariants && product.variants[selectedVariant]?.label && (
          <p className="text-[10px] text-slate-500 mb-2">
            Selected: <span className="text-blue-300 font-bold">{product.variants[selectedVariant].label}</span>
          </p>
        )}

        <AddToCartButton product={cartProduct} className="w-full text-xs py-2 rounded-xl" />
      </div>
    </div>
  );
}