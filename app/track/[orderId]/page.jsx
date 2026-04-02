"use client";
import { useEffect, useState, useRef } from "react";
import { use } from "react";
import dynamic from "next/dynamic";

const TrackingMap = dynamic(() => import("../../components/TrackingMap"), { ssr: false });

const STATUS_STEPS = [
  { key: "placed", label: "Order Placed", icon: "📋" },
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "preparing", label: "Preparing", icon: "📦" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: "🛵" },
  { key: "delivered", label: "Delivered", icon: "🎉" },
];
const STATUS_INDEX = { placed: 0, confirmed: 1, preparing: 2, out_for_delivery: 3, delivered: 4 };

export default function TrackOrderPage({ params }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/socket?orderId=${orderId}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
      setError("");
    } catch {
      setError("Could not load order. Please check your Order ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    intervalRef.current = setInterval(fetchOrder, 15000);
    return () => clearInterval(intervalRef.current);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#22323c] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#17d492] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-bold">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#22323c] flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-white text-lg font-black">{error || "Order not found"}</p>
          <a href="/" className="mt-4 inline-block text-[#17d492] underline font-bold">Go Home</a>
        </div>
      </div>
    );
  }

  const currentStep = STATUS_INDEX[order.status] ?? 0;
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";
  const hasLocation = order.deliveryLocation?.lat && order.deliveryLocation?.lng;

  return (
    <div className="min-h-screen bg-[#22323c] text-[#f5f5f5] py-10 px-4 pt-28">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#17d492] text-xs font-black uppercase tracking-widest mb-1">Live Tracking</p>
          <h1 className="text-2xl md:text-3xl font-black">Order #{order.orderId}</h1>
          <p className="text-slate-500 text-sm mt-1">Auto-refreshes every 15 seconds</p>
        </div>

        {/* Status Banner */}
        <div className={`rounded-2xl p-5 mb-8 border ${
          isCancelled ? "bg-red-500/10 border-red-500/30" :
          isDelivered ? "bg-[#17d492]/10 border-[#17d492]/30" :
          "bg-[#1a2830] border-white/5"
        }`}>
          <div className="flex items-center gap-4">
            <span className="text-4xl">
              {isCancelled ? "❌" : STATUS_STEPS[currentStep]?.icon || "📋"}
            </span>
            <div className="flex-1">
              <p className="font-black text-lg text-[#17d492]">
                {isCancelled ? "Order Cancelled" : STATUS_STEPS[currentStep]?.label}
              </p>
              {order.estimatedDelivery && !isCancelled && (
                <p className="text-sm text-white/50 mt-0.5">
                  Est. delivery: {new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
            {!isCancelled && !isDelivered && (
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-[#17d492] rounded-full animate-ping" />
                <span className="text-xs text-[#17d492] font-black">LIVE</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        {!isCancelled && (
          <div className="bg-[#1a2830] rounded-2xl p-6 mb-8 border border-white/5">
            <h2 className="font-black text-[#17d492] mb-6 text-sm uppercase tracking-widest">Order Progress</h2>
            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-white/5" />
              <div
                className="absolute left-5 top-5 w-0.5 bg-[#17d492] transition-all duration-1000"
                style={{ height: `${(currentStep / (STATUS_STEPS.length - 1)) * 90}%` }}
              />
              <div className="space-y-6">
                {STATUS_STEPS.map((step, idx) => {
                  const done = idx <= currentStep;
                  const active = idx === currentStep;
                  const update = order.trackingUpdates?.find((u) => u.status === step.key);
                  return (
                    <div key={step.key} className="flex items-start gap-4 relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 z-10 transition-all duration-500 ${
                        done ? "bg-[#17d492] text-[#22323c]" : "bg-[#22323c] text-white/20 border border-white/10"
                      } ${active ? "ring-4 ring-[#17d492]/25 scale-110" : ""}`}>
                        {step.icon}
                      </div>
                      <div className="pt-2">
                        <p className={`font-black text-sm ${done ? "text-white" : "text-white/20"}`}>{step.label}</p>
                        {update && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {update.message} · {new Date(update.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        {hasLocation && (
          <div className="bg-[#1a2830] rounded-2xl p-4 mb-8 border border-white/5 overflow-hidden">
            <h2 className="font-black text-[#17d492] mb-3 text-sm uppercase tracking-widest">Delivery Location</h2>
            <div className="rounded-xl overflow-hidden" style={{ height: "280px" }}>
              <TrackingMap lat={order.deliveryLocation.lat} lng={order.deliveryLocation.lng} />
            </div>
            <p className="text-xs text-slate-600 mt-2 text-center">📍 Live delivery partner location</p>
          </div>
        )}

        {/* Activity Log */}
        {order.trackingUpdates?.length > 0 && (
          <div className="bg-[#1a2830] rounded-2xl p-6 border border-white/5">
            <h2 className="font-black text-[#17d492] mb-4 text-sm uppercase tracking-widest">Activity Log</h2>
            <div className="space-y-3">
              {[...order.trackingUpdates].reverse().map((update, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <span className="text-slate-600 text-xs mt-0.5 whitespace-nowrap font-bold">
                    {new Date(update.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="text-slate-300">{update.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
