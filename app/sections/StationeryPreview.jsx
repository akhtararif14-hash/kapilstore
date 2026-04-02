"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  FaPencilAlt,
  FaBook,
  FaCalculator,
  FaFolder,
  FaPen,
  FaArrowRight,
} from "react-icons/fa";
import { MdDraw } from "react-icons/md";

const STATIONERY_SUBS = [
  {
    id: "books-notebooks",
    label: "Books & Notebooks",
    icon: <FaBook size={22} />,
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    id: "calculators",
    label: "Calculators",
    icon: <FaCalculator size={22} />,
    color: "from-slate-500/20 to-gray-500/20",
    border: "border-slate-500/30",
    iconColor: "text-slate-300",
  },
  {
    id: "drawing-materials",
    label: "Drawing Materials",
    icon: <MdDraw size={22} />,
    color: "from-purple-500/20 to-violet-500/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    id: "pens",
    label: "Pens (All Types)",
    icon: <FaPen size={22} />,
    color: "from-cyan-500/20 to-sky-500/20",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    id: "files-folders",
    label: "Files & Folders",
    icon: <FaFolder size={22} />,
    color: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/30",
    iconColor: "text-yellow-400",
  },
  {
    id: "btech-polytechnic",
    label: "BTech & Polytechnic",
    icon: <FaPencilAlt size={22} />,
    color: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
  },
];

export default function StationeryPreview() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch("/api/products?category=stationery&limit=3")
      .then((r) => r.json())
      .then((d) => setFeatured(Array.isArray(d) ? d.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  return (
    <section id="stationery" className="bg-[#22323c] py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black tracking-widest uppercase mb-4">
            <FaPencilAlt size={10} /> Stationery Store
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            All <span className="text-blue-400">Stationery</span>
          </h2>
          <p className="text-slate-400 mt-3 font-medium max-w-xl mx-auto">
            Notebooks, pens, drawing sets, calculators and everything a student
            needs at the lowest price.
          </p>
        </div>

        {/* Subcategory cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-12">
          {STATIONERY_SUBS.map((sub) => (
            <Link
              key={sub.id}
              href={`/stationery`}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-gradient-to-br ${sub.color} border ${sub.border}
                hover:scale-105 transition-transform duration-200 text-center`}
            >
              <span className={sub.iconColor}>{sub.icon}</span>
              <span className="text-xs font-black text-white leading-tight">
                {sub.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Featured products */}
        {featured.length > 0 && (
          <>
            <h3 className="text-xl font-black text-white mb-6">
              Featured Stationery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/stationery"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-3.5 rounded-xl font-black hover:bg-blue-600 hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Shop All Stationery <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
