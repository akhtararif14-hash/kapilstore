"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  FaShoppingBasket,
  FaLeaf,
  FaDrumstickBite,
  FaIceCream,
  FaSeedling,
  FaCarrot,
  FaCookie,
  FaArrowRight,
} from "react-icons/fa";
import { MdLocalDrink } from "react-icons/md";

const GROCERY_CATEGORIES = [
  {
    id: "dairy",
    label: "Dairy Products",
    icon: <MdLocalDrink size={24} />,
    href: "/grocery?sub=dairy",
    color: "from-sky-500/20 to-blue-500/20",
    border: "border-sky-500/30",
    iconColor: "text-sky-400",
  },
  {
    id: "fruits-vegetables",
    label: "Fruits & Vegetables",
    icon: <FaCarrot size={24} />,
    href: "/grocery?sub=fruits-vegetables",
    color: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    iconColor: "text-green-400",
  },
  {
    id: "snacks-namkeen",
    label: "Snacks & Namkeen",
    icon: <FaCookie size={24} />,
    href: "/grocery?sub=snacks-namkeen",
    color: "from-orange-500/20 to-yellow-500/20",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
  },
  {
    id: "dry-fruits",
    label: "Dry Fruits & Nuts",
    icon: <FaSeedling size={24} />,
    href: "/grocery?sub=dry-fruits",
    color: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    id: "meat-fish",
    label: "Meat & Fish",
    icon: <FaDrumstickBite size={24} />,
    href: "/grocery?sub=meat-fish",
    color: "from-red-500/20 to-orange-500/20",
    border: "border-red-500/30",
    iconColor: "text-red-400",
  },
  {
    id: "student-daily",
    label: "Student Daily Use",
    icon: <FaLeaf size={24} />,
    href: "/grocery?sub=student-daily",
    color: "from-teal-500/20 to-cyan-500/20",
    border: "border-teal-500/30",
    iconColor: "text-teal-400",
  },
];

export default function GroceriesPreview() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch("/api/products?category=grocery&limit=3")
      .then((r) => r.json())
      .then((d) => setFeatured(Array.isArray(d) ? d.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  return (
    <section id="groceries" className="bg-[#1a2830] py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-black tracking-widest uppercase mb-4">
            <FaShoppingBasket size={10} /> Grocery Section
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Groceries &amp; <span className="text-green-400">Essentials</span>
          </h2>
          <p className="text-slate-400 mt-3 font-medium max-w-xl mx-auto">
            Daily essentials, fresh fruits, vegetables, snacks and more —
            delivered fast to your doorstep.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-12">
          {GROCERY_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href="/groceries"
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border}
                hover:scale-105 transition-transform duration-200 text-center`}
            >
              <span className={cat.iconColor}>{cat.icon}</span>
              <span className="text-xs font-black text-white leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Featured products */}
        {featured.length > 0 && (
          <>
            <h3 className="text-xl font-black text-white mb-6">
              Featured Grocery Items
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
            href="/groceries"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3.5 rounded-xl font-black hover:bg-green-600 hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Shop All Groceries <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
