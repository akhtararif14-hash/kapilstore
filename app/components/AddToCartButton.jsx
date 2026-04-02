"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function AddToCartButton({ product, className = "" }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);

    setAdded(true); // only this button shows “Added ✓”
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`px-4 py-2 rounded-lg font-medium transition active:scale-95
        ${
          added
            ? "bg-green-500 text-white"
            : "bg-[#17d492] text-[#22323c] hover:opacity-90"
        }
        ${className} cursor-pointer`}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
