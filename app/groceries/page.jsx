"use client";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import ProductCard from "../components/ProductCard";
import { Search, PackageSearch, Loader2 } from "lucide-react";
import {
  FaShoppingBasket,
  FaWhatsapp,
  FaLeaf,
  FaDrumstickBite,
  FaCarrot,
  FaSeedling,
  FaBoxOpen,
  FaBolt,
  FaFish,
  FaCandyCane,
  FaSnowflake,
  FaAppleAlt,
} from "react-icons/fa";
import {
  MdLocalDrink,
  MdKitchen,
  MdOutlineFastfood,
  MdSoupKitchen,
  MdGrass,
} from "react-icons/md";
import {
  GiCoconuts,
  GiSprout,
  GiChocolateBar,
  GiWaterDrop,
} from "react-icons/gi";
import { BiDrink } from "react-icons/bi";

const SUBCATEGORIES = [
  { id: "all", label: "All", Icon: FaShoppingBasket },
  { id: "dairy", label: "Dairy Products", Icon: MdLocalDrink },
  { id: "student-daily", label: "Student Daily Use", Icon: FaBoxOpen },
  { id: "chocolates", label: "Chocolates", Icon: GiChocolateBar },
  { id: "dry-fruits", label: "Dry Fruits & Nuts", Icon: FaSeedling },
  { id: "snacks-namkeen", label: "Snacks & Namkeen", Icon: FaCandyCane },
  { id: "kitchen", label: "Kitchen Ingredients", Icon: MdKitchen },
  { id: "instant-food", label: "Instant Food", Icon: MdOutlineFastfood },
  { id: "energy-drinks", label: "Energy Drinks", Icon: FaBolt },
  { id: "beverages", label: "Beverages", Icon: BiDrink },
  { id: "meat-fish", label: "Meat & Fish", Icon: FaFish },
  { id: "frozen-packaged", label: "Frozen & Packaged", Icon: FaSnowflake },
  { id: "seasonal-fruits", label: "Seasonal Fruits", Icon: FaAppleAlt },
  { id: "green-vegetables", label: "Green Vegetables", Icon: MdGrass },
  { id: "cut-fruits", label: "Cut Fruits", Icon: FaLeaf },
  { id: "fruits-vegetables", label: "Fruits & Vegetables", Icon: FaCarrot },
  { id: "sprouts", label: "Sprouts", Icon: GiSprout },
  { id: "coconut-water", label: "Coconut Water", Icon: GiCoconuts },
  { id: "healthy-fruits", label: "Healthy Fruits", Icon: FaAppleAlt },
];

const PRODUCTS_PER_PAGE = 9;

export default function GroceryPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?category=grocery")
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list =
      activeTab === "all"
        ? products
        : products.filter((p) => p.subcategory === activeTab);
    if (query) {
      const fuse = new Fuse(list, {
        keys: ["title", "description"],
        threshold: 0.3,
      });
      list = fuse.search(query).map((r) => r.item);
    }
    return list;
  }, [products, activeTab, query]);

  const visibleProducts = filtered.slice(0, visibleCount);

  const counts = useMemo(() => {
    const map = { all: products.length };
    products.forEach((p) => {
      map[p.subcategory] = (map[p.subcategory] || 0) + 1;
    });
    return map;
  }, [products]);

  return (
    <div className="min-h-screen bg-[#22323c] text-[#f5f5f5]">
      {/* Hero */}
      <div className="bg-[#1a2830] pt-28 pb-12 px-4 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-black tracking-widest uppercase mb-4">
            <FaShoppingBasket size={10} /> Grocery Store
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Groceries & <span className="text-green-400">Essentials</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl">
            Daily essentials, fresh produce, snacks and more — delivered fast to
            your doorstep.
          </p>

          {!loading && products.length > 0 && (
            <div className="flex items-center gap-6 mt-6">
              <div className="text-center">
                <p className="text-2xl font-black text-green-400">
                  {products.length}
                </p>
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  Items
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-black text-green-400">
                  {[...new Set(products.map((p) => p.subcategory))].length}
                </p>
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  Categories
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-black text-green-400">45–90</p>
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  Min Delivery
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6 max-w-2xl relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-green-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search grocery items..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(PRODUCTS_PER_PAGE);
            }}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-700 bg-[#1a2830] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition shadow-lg"
          />
          {query && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-green-400 bg-green-500/10 px-2 py-1 rounded">
              {filtered.length} RESULTS
            </div>
          )}
        </div>

        {/* Subcategory tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8">
          {SUBCATEGORIES.map((sub) => {
            const count = counts[sub.id] || 0;
            const isActive = activeTab === sub.id;
            const { Icon } = sub;
            if (sub.id !== "all" && count === 0 && !loading) return null;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setActiveTab(sub.id);
                  setVisibleCount(PRODUCTS_PER_PAGE);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition shrink-0 ${
                  isActive
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-[#1a2830] text-slate-400 border border-white/10 hover:border-green-500/40 hover:text-green-300"
                }`}
              >
                <Icon
                  size={12}
                  className={isActive ? "text-white" : "text-green-400/70"}
                />
                {sub.label}
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-slate-500"
                    }`}
                  >
                    {sub.id === "all" ? products.length : count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="animate-spin text-green-400 mb-4" size={40} />
            <p className="font-black tracking-widest uppercase text-xs">
              Loading products...
            </p>
          </div>
        )}

        {/* Products grid */}
        {!loading && (
          <>
            {visibleProducts.length > 0 ? (
              <>
                <p className="text-slate-500 text-sm font-bold mb-5">
                  Showing{" "}
                  <span className="text-green-400">
                    {Math.min(visibleCount, filtered.length)}
                  </span>{" "}
                  of <span className="text-green-400">{filtered.length}</span>{" "}
                  products
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-[#1a2830] rounded-3xl border border-dashed border-slate-700">
                <PackageSearch size={48} className="text-slate-600 mb-4" />
                <p className="text-xl font-black text-slate-400">
                  No products found
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  Check back soon — we're stocking up!
                </p>
                {(query || activeTab !== "all") && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setActiveTab("all");
                    }}
                    className="mt-4 text-green-400 text-sm font-black underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {filtered.length > PRODUCTS_PER_PAGE && (
              <div className="mt-12 flex justify-center gap-4">
                {visibleCount < filtered.length && (
                  <button
                    onClick={() =>
                      setVisibleCount((p) => p + PRODUCTS_PER_PAGE)
                    }
                    className="bg-green-500 text-white px-10 py-4 rounded-xl font-black hover:bg-green-600 hover:scale-105 transition shadow-lg"
                  >
                    Load More
                  </button>
                )}
                {visibleCount > PRODUCTS_PER_PAGE && (
                  <button
                    onClick={() => {
                      setVisibleCount(PRODUCTS_PER_PAGE);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="border-2 border-slate-700 text-slate-300 px-10 py-4 rounded-xl font-black hover:bg-slate-800 transition"
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        {!loading && (
          <div className="mt-16 text-center">
            <div className="inline-block bg-[#1a2830] border border-green-500/15 rounded-2xl px-8 py-6">
              <p className="text-white font-black text-lg mb-1">
                Don't see what you need?
              </p>
              <p className="text-slate-500 text-sm mb-5">
                Message us and we'll source it for you.
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
    </div>
  );
}
