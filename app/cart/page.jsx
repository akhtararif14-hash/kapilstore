"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#22323c] text-[#f5f5f5]">
        <p className="text-lg">Your cart is empty 🛒</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#22323c] text-[#f5f5f5]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-[#17d492]">Your Cart</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="flex flex-col sm:flex-row gap-4 bg-[#334b54] rounded-xl p-4"
              >
                <img
                  src={
                    Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0]
                      : "/placeholder.png"
                  }
                  alt={item.title}
                  className="w-full sm:w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-[#f5f5f5]/70 mt-1">
                    ₹{item.price} each
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(item.cartItemId)}
                      className="w-8 h-8 rounded-full bg-[#22323c] border border-[#17d492] disabled:opacity-40 cursor-pointer"
                    >
                      −
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.cartItemId)}
                      className="w-8 h-8 rounded-full bg-[#17d492] text-[#22323c] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-red-400 hover:text-red-500 text-sm self-start sm:self-center"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-[#334b54] rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-semibold text-lg mb-4 text-[#17d492]">
              Order Summary
            </h2>

            <div className="flex justify-between mb-3">
              <span>Total Items</span>
              <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>

            <div className="flex justify-between mb-6 text-lg font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-[#17d492] text-[#22323c] py-3 rounded-lg 
              font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Proceed to Checkout
            </button>

            <p className="text-xs text-center mt-3 text-[#f5f5f5]/70">
              Cash on Delivery available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
