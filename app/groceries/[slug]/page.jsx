"use client";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import ProductCard from "../../components/ProductCard";
import { Search, PackageSearch, Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import {
  FaWhatsapp,
  FaArrowLeft,
  FaShoppingBasket,
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
  MdGrass,
} from "react-icons/md";
import { GiCoconuts, GiSprout, GiChocolateBar } from "react-icons/gi";
import { BiDrink } from "react-icons/bi";

// Maps URL slug → { subcategoryId, label, Icon }
const SLUG_MAP = {
  dairy: { id: "dairy", label: "Dairy Products", Icon: MdLocalDrink },
  "student-daily": {
    id: "student-daily",
    label: "Student Daily Use",
    Icon: FaBoxOpen,
  },
  chocolates: { id: "chocolates", label: "Chocolates", Icon: GiChocolateBar },
  "dry-fruits": {
    id: "dry-fruits",
    label: "Dry Fruits & Nuts",
    Icon: FaSeedling,
  },
  "snacks-namkeen": {
    id: "snacks-namkeen",
    label: "Snacks & Namkeen",
    Icon: FaCandyCane,
  },
  kitchen: { id: "kitchen", label: "Kitchen Ingredients", Icon: MdKitchen },
  "instant-food": {
    id: "instant-food",
    label: "Instant Food",
    Icon: MdOutlineFastfood,
  },
  "energy-drinks": {
    id: "energy-drinks",
    label: "Energy Drinks",
    Icon: FaBolt,
  },
  beverages: { id: "beverages", label: "Beverages", Icon: BiDrink },
  "meat-fish": { id: "meat-fish", label: "Meat & Fish", Icon: FaFish },
  "frozen-packaged": {
    id: "frozen-packaged",
    label: "Frozen & Packaged Food",
    Icon: FaSnowflake,
  },
  "seasonal-fruits": {
    id: "seasonal-fruits",
    label: "Seasonal Fruits",
    Icon: FaAppleAlt,
  },
  "green-vegetables": {
    id: "green-vegetables",
    label: "Green Vegetables",
    Icon: MdGrass,
  },
  "cut-fruits": { id: "cut-fruits", label: "Cut Fruits", Icon: FaLeaf },
  "fruits-vegetables": {
    id: "fruits-vegetables",
    label: "Fruits & Vegetables",
    Icon: FaCarrot,
  },
  sprouts: { id: "sprouts", label: "Sprouts", Icon: GiSprout },
  "coconut-water": {
    id: "coconut-water",
    label: "Coconut Water",
    Icon: GiCoconuts,
  },
  "healthy-fruits": {
    id: "healthy-fruits",
    label: "Healthy Fruits",
    Icon: FaAppleAlt,
  },
};

const PRODUCTS_PER_PAGE = 9;

export default function GrocerySubcategoryPage({ params }) {
  const { slug } = use(params);
  const catInfo = SLUG_MAP[slug] || {
    id: slug,
    label: slug,
    Icon: FaShoppingBasket,
  };
  const { Icon } = catInfo;

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?category=grocery&subcategory=${catInfo.id}`)
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [catInfo.id]);

  const filtered = useMemo(() => {
    if (!query) return products;
    const fuse = new Fuse(products, {
      keys: ["title", "description"],
      threshold: 0.3,
    });
    return fuse.search(query).map((r) => r.item);
  }, [products, query]);

  const visibleProducts = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#22323c] text-[#f5f5f5]">
      {/* Hero */}
      <div className="bg-[#1a2830] pt-28 pb-10 px-4 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
            <Link
              href="/grocery"
              className="hover:text-green-400 transition flex items-center gap-1.5"
            >
              <FaArrowLeft size={10} /> Grocery
            </Link>
            <span>›</span>
            <span className="text-slate-300">{catInfo.label}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center shrink-0">
              <Icon size={22} className="text-green-400" />
            </div>
            <span>{catInfo.label}</span>
          </h1>

          {!loading && (
            <p className="text-slate-400 mt-3 font-medium ml-16">
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              available
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8 max-w-2xl relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-green-400" size={18} />
          </div>
          <input
            type="text"
            placeholder={`Search ${catInfo.label}...`}
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

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="animate-spin text-green-400 mb-4" size={40} />
            <p className="font-black tracking-widest uppercase text-xs">
              Loading...
            </p>
          </div>
        )}

        {/* Products */}
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
                  No products here yet
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  Check back soon — we're stocking up!
                </p>
                <Link
                  href="/grocery"
                  className="mt-5 text-green-400 text-sm font-black underline underline-offset-4 flex items-center gap-1.5"
                >
                  <FaArrowLeft size={10} /> Back to All Groceries
                </Link>
              </div>
            )}

            {/* Pagination */}
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
                Need something specific?
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
