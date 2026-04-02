"use client";

import { products } from "../../constant/product.js";
import { slugify } from "../../utils/slugify";
import AddToCartButton from "../../components/AddToCartButton";

export default function ProductPage({ params }) {
  console.log("params.slug:", params.slug);
  console.log(
    "all product slugs:",
    products.map((p) => slugify(p.title)),
  );

  const product = products.find((item) => slugify(item.title) === params.slug);

  if (!product) {
    return (
      <h1 className="text-center mt-10 text-red-500">Product not found</h1>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      {/* Images */}
      <div>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full rounded-xl"
        />

        <div className="flex gap-4 mt-4">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className="w-20 h-20 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>

      {/* Details */}
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>

        <p className="mt-4 text-gray-600">{product.description}</p>

        <p className="mt-6 text-2xl font-bold text-[#17d492]">
          ₹{product.price}
        </p>

        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
