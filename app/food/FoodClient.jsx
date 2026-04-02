"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AddToCartButton from "../components/AddToCartButton";
import {
  FaSearch,
  FaWhatsapp,
  FaLeaf,
  FaDrumstickBite,
  FaHamburger,
  FaIceCream,
  FaUtensils,
} from "react-icons/fa";
import {
  MdOutdoorGrill,
  MdCake,
  MdOutlineFastfood,
  MdRiceBowl,
  MdBakeryDining,
} from "react-icons/md";
import { GiChickenLeg } from "react-icons/gi";
import { Loader2, PackageSearch } from "lucide-react";

const SUBCATEGORIES = [
  {
    id: "all",
    label: "All Food",
    Icon: FaUtensils,
    color: "bg-[#17d492] text-[#22323c]",
  },
  {
    id: "fast-food",
    label: "Fast Food",
    Icon: MdOutlineFastfood,
    color: "bg-orange-500 text-white",
  },
  {
    id: "veg-food",
    label: "Veg Food",
    Icon: FaLeaf,
    color: "bg-green-500  text-white",
  },
  {
    id: "non-veg-food",
    label: "Non Veg Food",
    Icon: GiChickenLeg,
    color: "bg-red-500    text-white",
  },
  {
    id: "sweets-desserts",
    label: "Sweets",
    Icon: MdCake,
    color: "bg-pink-500   text-white",
  },
  {
    id: "bakery",
    label: "Bakery",
    Icon: MdBakeryDining,
    color: "bg-amber-500  text-white",
  },
  {
    id: "ice-cream",
    label: "Ice Cream",
    Icon: FaIceCream,
    color: "bg-sky-500    text-white",
  },
  {
    id: "tiffin",
    label: "Tiffin Services",
    Icon: MdRiceBowl,
    color: "bg-purple-500 text-white",
  },
];

const SUB_COLORS = {
  "fast-food": {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
  },
  "veg-food": {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
  },
  "non-veg-food": {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
  },
  "sweets-desserts": {
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    text: "text-pink-400",
  },
  bakery: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
  "ice-cream": {
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    text: "text-sky-400",
  },
  tiffin: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
  },
};

function FoodContent() {
  const searchParams = useSearchParams();
  const initialSub = searchParams.get("sub") || "all";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSub, setActiveSub] = useState(initialSub);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products?category=food");
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

  const counts = useMemo(() => {
    const map = { all: products.length };
    products.forEach((p) => {
      map[p.subcategory] = (map[p.subcategory] || 0) + 1;
    });
    return map;
  }, [products]);

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
      <div className="relative bg-[#1a2830] border-b border-white/5 pt-28 pb-12 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-3xl rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-5">
            <FaUtensils size={11} className="text-orange-400" />
            <span className="text-orange-400 text-xs font-black uppercase tracking-widest">
              Food Menu
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Hot <span className="text-orange-400">Food</span> Delivered Fast
          </h1>
          <p className="text-white/40 text-base max-w-xl mx-auto">
            Veg, non-veg, fast food, tiffin, sweets and more — freshly made and
            delivered within 45–90 minutes.
          </p>

          {!loading && products.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-7">
              <div className="text-center">
                <p className="text-2xl font-black text-orange-400">
                  {products.length}
                </p>
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  Items
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-black text-orange-400">45–90</p>
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  Min Delivery
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-black text-orange-400">8AM–12AM</p>
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  Open Daily
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky filters */}
      <div className="sticky top-[60px] z-30 bg-[#22323c]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
          <div className="relative sm:w-64 shrink-0">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400/50 text-xs pointer-events-none" />
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1a2830] border border-white/10
                focus:outline-none focus:border-orange-400 text-white placeholder:text-white/20 text-sm transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-1">
            {SUBCATEGORIES.map((sub) => {
              const { Icon } = sub;
              const count = counts[sub.id] || 0;
              const isActive = activeSub === sub.id;
              if (sub.id !== "all" && count === 0 && !loading) return null;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition shrink-0 ${
                    isActive
                      ? sub.color
                      : "bg-[#1a2830] text-slate-400 border border-white/10 hover:border-orange-400/40 hover:text-orange-300"
                  }`}
                >
                  <Icon size={11} />
                  {sub.label}
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                        isActive ? "bg-black/20" : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {sub.id === "all" ? products.length : count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-orange-400" size={40} />
            <p className="text-white/30 text-sm font-black uppercase tracking-widest">
              Loading menu...
            </p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-28">
            <PackageSearch size={56} className="text-white/10 mx-auto mb-5" />
            <p className="text-white/30 font-bold text-lg">
              {search
                ? `No results for "${search}"`
                : "No items in this category yet"}
            </p>
            {(search || activeSub !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveSub("all");
                }}
                className="mt-4 text-orange-400 text-sm font-black underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
            <div className="mt-8 inline-block bg-[#1a2830] border border-white/5 rounded-2xl px-6 py-5">
              <p className="text-white/50 text-sm mb-3">
                Want to order something specific?
              </p>
              <a
                href="https://wa.me/917982670413"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#17d492] text-[#22323c] px-5 py-2.5 rounded-xl font-black text-sm hover:bg-[#14b87e] transition"
              >
                <FaWhatsapp size={15} /> WhatsApp to Order
              </a>
            </div>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p className="text-slate-500 text-sm font-bold mb-6">
              Showing <span className="text-orange-400">{filtered.length}</span>{" "}
              item{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((product) => (
                <FoodCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA */}
      {!loading && (
        <div className="max-w-4xl mx-auto px-4 pb-16 text-center">
          <div className="bg-[#1a2830] border border-orange-500/15 rounded-2xl px-6 py-7">
            <p className="text-white font-black text-lg mb-1">
              Want something not listed?
            </p>
            <p className="text-slate-500 text-sm mb-5">
              Message us and we'll arrange it for you.
            </p>
            <a
              href="https://wa.me/917982670413"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#17d492] text-[#22323c] px-6 py-3 rounded-xl font-black hover:bg-[#14b87e] transition text-sm"
            >
              <FaWhatsapp size={15} /> WhatsApp: 7982670413
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function FoodCard({ product }) {
  const price = Number(product.price || 0);
  const actualPrice = Number(product.actualPrice || 0);
  const hasDiscount = actualPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((actualPrice - price) / actualPrice) * 100)
    : 0;
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["/placeholder.png"];
  const [imgIdx, setImgIdx] = useState(0);

  const subStyle = SUB_COLORS[product.subcategory] || {
    bg: "bg-white/5",
    border: "border-white/10",
    text: "text-white/50",
  };
  const subMeta = SUBCATEGORIES.find((s) => s.id === product.subcategory);
  const SubIcon = subMeta?.Icon;
  const subLabel = subMeta?.label || product.subcategory;

  return (
    <div className="bg-[#1a2830] border border-white/5 rounded-2xl overflow-hidden hover:border-orange-400/30 transition-all group flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-[#22323c] shrink-0">
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
                className={`w-1.5 h-1.5 rounded-full transition ${i === imgIdx ? "bg-orange-400" : "bg-white/30"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <span
          className={`self-start flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full mb-2 ${subStyle.bg} ${subStyle.text} border ${subStyle.border}`}
        >
          {SubIcon && <SubIcon size={9} />}
          {subLabel}
        </span>
        <p className="text-sm font-black text-white line-clamp-2 mb-1">
          {product.title}
        </p>
        {product.description && (
          <p className="text-xs text-slate-500 line-clamp-1 mb-1">
            {product.description}
          </p>
        )}
        {product.unit && (
          <p className="text-xs text-slate-500 mb-2">{product.unit}</p>
        )}
        <div className="flex items-center gap-2 mb-3 mt-auto">
          <span className="text-base font-black text-orange-400">
            {price > 0 ? `₹${price}` : "Contact"}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-500 line-through">
              ₹{actualPrice}
            </span>
          )}
        </div>
        <AddToCartButton
          product={product}
          className="w-full text-xs py-2 rounded-xl"
        />
      </div>
    </div>
  );
}

export default function FoodClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#22323c] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <FoodContent />
    </Suspense>
  );
}
