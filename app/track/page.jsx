// app/track/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaBox } from "react-icons/fa";


export default function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  const handleTrack = () => {
    const trimmed = orderId.trim();
    if (!trimmed) return;
    router.push(`/track/${trimmed}`);
  };

  return (
    <div className="min-h-screen bg-[#22323c] text-[#f5f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex  justify-between items-center flex-col">
          <span className="text-5xl text-center text-[#17d492]">
            <FaBox />
          </span>
          <h1 className="text-3xl font-black mt-4 mb-2">Track Your Order</h1>
          <p className="text-slate-400 text-sm">
            Enter the Order ID from your confirmation email
          </p>
        </div>

        <div className="bg-[#1a2830] rounded-2xl p-6 border border-white/5">
          <label className="block text-xs font-black text-[#17d492] uppercase tracking-widest mb-2">
            Order ID
          </label>
          <input
            type="text"
            placeholder="e.g. ORD-1712345678900"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 
              focus:outline-none focus:border-[#17d492] transition text-white font-mono mb-4"
          />
          <button
            onClick={handleTrack}
            disabled={!orderId.trim()}
            className="w-full py-3.5 rounded-xl font-black bg-[#17d492] text-[#22323c] 
              hover:bg-[#14b87e] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Track Order →
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Find your Order ID in the confirmation email sent to your inbox
        </p>
      </div>
    </div>
  );
}
