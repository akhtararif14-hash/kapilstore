"use client";

import { useCart } from "../context/CartContext.js";
import { useState } from "react";
import Script from "next/script";
import {
  FaCheckCircle,
  FaWhatsapp,
  FaClock,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBolt,
  FaCalendarCheck,
  FaLock,
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [isJamiaStudent, setIsJamiaStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryCharge = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + deliveryCharge;

  const validateForm = () => {
    if (!form.name.trim()) {
      alert("Please enter your full name");
      return false;
    }
    if (!form.phone.trim()) {
      alert("Please enter your phone number");
      return false;
    }
    if (!form.address.trim()) {
      alert("Please enter your delivery address");
      return false;
    }
    if (isJamiaStudent === null) {
      alert("Please select whether you are a Jamia student");
      return false;
    }
    return true;
  };

  const handlePayClick = async () => {
    if (!validateForm()) return;
    if (!razorpayLoaded) {
      alert("Payment gateway is still loading, please try again.");
      return;
    }

    setLoading(true);

    try {
      const orderRes = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { ...form, isJamiaStudent },
          cart,
          total: grandTotal,
          deliveryCharge,
          paymentMethod: "razorpay",
          paymentStatus: "pending_verification",
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      const internalOrderId = orderData.orderId;

      const rzpRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal }),
      });

      const rzpData = await rzpRes.json();

      if (!rzpRes.ok) {
        throw new Error(rzpData.error || "Failed to initiate payment");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: "Kapil Store",
        description: "Stationery Order",
        image: "/image.png",
        order_id: rzpData.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          address: form.address,
          internalOrderId,
        },
        theme: { color: "#17d492" },

        handler: async (response) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: internalOrderId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            setPlacedOrderId(internalOrderId);
            setSuccess(true);
            clearCart();
            setForm({ name: "", phone: "", email: "", address: "" });
          } else {
            alert(
              "Payment verification failed. Please contact support with Payment ID: " +
                response.razorpay_payment_id,
            );
          }

          setLoading(false);
        },

        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  //Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-[#22323c] text-[#f5f5f5] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <FaCheckCircle size={64} className="text-[#17d492] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#17d492] mb-2">
            Order Placed!
          </h2>
          <p className="text-white/70 mb-1">
            Order ID:{" "}
            <span className="font-mono text-white">{placedOrderId}</span>
          </p>
          <p className="text-green-400 text-sm mb-2 font-semibold">
            Payment confirmed successfully.
          </p>
          <p className="text-white/50 text-sm mb-8">
            We'll contact you soon to confirm delivery.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={`/track/${placedOrderId}`}
              className="bg-[#17d492] text-[#22323c] py-3 px-6 rounded-xl font-black hover:bg-[#14b87e] transition"
            >
              Track Your Order
            </a>
            <a
              href="/"
              className="border-2 border-slate-700 text-slate-300 py-3 px-6 rounded-xl font-bold hover:bg-slate-800 transition"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#22323c] text-[#f5f5f5] py-10 px-4 pt-28">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-black mb-8 text-[#17d492]">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* LEFT */}
            <div className="space-y-6">
              {/* Delivery Details */}
              <div className="bg-[#1a2830] rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-black mb-4 text-[#17d492]">
                  Delivery Details
                </h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 focus:outline-none focus:border-[#17d492] transition"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 focus:outline-none focus:border-[#17d492] transition"
                  />
                  <input
                    type="email"
                    placeholder="Email (for order confirmation)"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 focus:outline-none focus:border-[#17d492] transition"
                  />

                  {/* Jamia Student Toggle */}
                  <div>
                    <p className="mb-2 font-bold text-[#17d492] text-sm">
                      Are you a Jamia student? *
                    </p>
                    <div className="flex gap-3">
                      {[
                        { val: true, label: "Yes" },
                        { val: false, label: "No" },
                      ].map((opt) => (
                        <label
                          key={String(opt.val)}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition text-sm font-bold ${
                            isJamiaStudent === opt.val
                              ? "border-[#17d492] bg-[#17d492]/10 text-[#17d492]"
                              : "border-white/10 text-slate-400 hover:border-white/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="jamia"
                            className="hidden"
                            onChange={() => setIsJamiaStudent(opt.val)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Complete Address (Building / Area / Landmark) *"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 focus:outline-none focus:border-[#17d492] transition"
                  />
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-[#1a2830] rounded-2xl p-6 border border-[#17d492]/20">
                <h2 className="text-lg font-black mb-4 text-[#17d492]">
                  Important Delivery Information
                </h2>
                <ul className="space-y-3">
                  {[
                    {
                      icon: FaCalendarCheck,
                      text: (
                        <>
                          Delivery available everyday —{" "}
                          <span className="text-white font-semibold">
                            8:00 AM to 12:00 AM
                          </span>
                        </>
                      ),
                    },
                    {
                      icon: FaBolt,
                      text: (
                        <>
                          Delivered within{" "}
                          <span className="text-white font-semibold">
                            45–90 minutes
                          </span>
                        </>
                      ),
                    },
                    {
                      icon: FaPhoneAlt,
                      text: (
                        <>
                          You'll receive a{" "}
                          <span className="text-white font-semibold">
                            confirmation mail
                          </span>{" "}
                          before delivery
                        </>
                      ),
                    },
                    {
                      icon: FaMapMarkerAlt,
                      text: (
                        <>
                          Mention your{" "}
                          <span className="text-white font-semibold">
                            exact location
                          </span>{" "}
                          in the address
                        </>
                      ),
                    },
                    {
                      icon: FaWhatsapp,
                      text: (
                        <>
                          For urgent orders, WhatsApp:{" "}
                          <a
                            href="https://wa.me/917982670413"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#17d492] font-black hover:underline"
                          >
                            7982670413
                          </a>
                        </>
                      ),
                    },
                  ].map(({ icon: Icon, text }, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-white/70"
                    >
                      <Icon
                        className="text-[#17d492] mt-0.5 shrink-0"
                        size={15}
                      />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment Method */}
              <div className="bg-[#1a2830] rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-black mb-4 text-[#17d492]">
                  Payment Method
                </h2>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-[#17d492] bg-[#17d492]/10">
                  <MdPayment size={24} className="text-[#17d492] shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white">
                      Razorpay — UPI / Cards / Net Banking / Wallets
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      GPay, PhonePe, Paytm, Credit/Debit Cards & more
                    </p>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-[#17d492] bg-[#17d492] shrink-0" />
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <FaLock size={10} />
                  256-bit SSL secured payment powered by Razorpay
                </p>
              </div>
            </div>

            {/* RIGHT - Order Summary */}
            <div className="bg-[#1a2830] rounded-2xl p-6 h-fit sticky top-28 border border-white/5">
              <h2 className="text-lg font-black mb-4 text-[#17d492]">
                Order Summary
              </h2>

              <div className="space-y-2 mb-4">
                {cart.length === 0 ? (
                  <p className="text-slate-400 text-sm">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={`${item.title}-${item.cartItemId}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-white/70">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="text-white">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Delivery{" "}
                    <span className="text-xs text-slate-600">(10%)</span>
                  </span>
                  <span>₹{deliveryCharge}</span>
                </div>
                <div className="flex justify-between font-black text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-[#17d492]">₹{grandTotal}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 bg-[#17d492]/5 border border-[#17d492]/15 rounded-xl px-4 py-3">
                <FaClock size={13} className="text-[#17d492] shrink-0" />
                <p className="text-xs text-slate-400">
                  Delivered in{" "}
                  <span className="text-white font-bold">45–90 mins</span> ·
                  Available 8 AM – 12 AM
                </p>
              </div>

              <button
                onClick={handlePayClick}
                disabled={loading || cart.length === 0}
                className={`w-full mt-5 py-4 rounded-xl font-black transition text-[#22323c] ${
                  loading || cart.length === 0
                    ? "bg-[#17d492]/50 cursor-not-allowed"
                    : "bg-[#17d492] hover:bg-[#14b87e] hover:-translate-y-0.5 active:scale-95 shadow-[0_10px_20px_-10px_rgba(23,212,146,0.4)]"
                }`}
              >
                {loading ? "Processing..." : `Pay ₹${grandTotal} Securely`}
              </button>

              <p className="text-xs text-center mt-3 text-slate-600 flex items-center justify-center gap-1">
                <FaLock size={9} /> Secure Checkout powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
