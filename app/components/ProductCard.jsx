"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import AddToCartButton from "../components/AddToCartButton";

export default function ProductCard({ product }) {
  if (!product) return null;

  const [currentImage, setCurrentImage] = useState(0);
  const intervalRef = useRef(null);

  const images = useMemo(() => {
    return Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["/placeholder.png"];
  }, [product.images]);

  const price = Number(product.price || 0);
  const actualPrice = Number(product.actualPrice || 0);

  const hasDiscount = actualPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((actualPrice - price) / actualPrice) * 100)
    : 0;

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [images.length]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div
      className="group bg-[#1a2830] rounded-2xl overflow-hidden flex flex-col hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 border border-white/5 relative"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      {/* ✅ Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {/* Discount Badge */}
        {hasDiscount && discountPercent > 0 && (
          <span className="absolute top-4 left-4 bg-[#17d492] text-[#22323c] text-[10px] font-black px-2.5 py-1 rounded-full z-10 shadow-lg uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        )}

        <img
          src={images[currentImage]}
          alt={product.title || "Product"}
          className="w-full h-full object-cover transition duration-700 transform group-hover:scale-110"
        />

        {/* Overlay Gradient for better text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2830] via-transparent to-transparent opacity-60"></div>

        {/* ✅ Animated Dots (Overlayed on image) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 backdrop-blur-md px-2 py-1.5 rounded-full">
            {images.map((_, index) => (
              <button
                key={index}
                onMouseEnter={() => setCurrentImage(index)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  currentImage === index ? "w-4 bg-[#17d492]" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-white group-hover:text-[#17d492] transition-colors line-clamp-1">
          {product.title}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-2 mt-2 font-medium leading-relaxed">
          {product.description}
        </p>

        {/* ✅ Price + Cart Section */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-slate-500 line-through mb-0.5">
                ₹{actualPrice}
              </span>
            )}
            <span className="font-black text-xl text-white">₹{price}</span>
          </div>

          <div className="transform transition-transform duration-300 hover:scale-105 active:scale-95">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}