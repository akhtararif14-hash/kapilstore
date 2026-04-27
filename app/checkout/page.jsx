"use client";

import { useCart } from "../context/CartContext.js";
import { useState, useEffect } from "react";
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
  FaMoneyBillWave,
  FaUserCheck,
  FaEdit,
  FaGift,
  FaTruck,
  FaHome,
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";

const ALL_TIME_SLOTS = [
  { id: "slot1", label: "8:50 AM – 9:20 AM", time: "08:50-09:20", jamiaOnly: true },
  { id: "slot2", label: "1:00 PM – 1:30 PM", time: "13:00-13:30", jamiaOnly: true },
  { id: "slot3", label: "4:30 PM – 5:30 PM", time: "16:30-17:30", jamiaOnly: true },
  { id: "slot4", label: "8:30 PM – 9:30 PM", time: "20:30-21:30", jamiaOnly: false },
];

const COD_PLATFORM_FEE = 5;
const STORAGE_KEY = "kapilstore_checkout_details";

const JAMIA_DELIVERY_INFO = [
  {
    icon: FaGift,
    text: (
      <>
        <span className="text-white font-semibold">Free delivery</span> for all
        Jamia Millia Islamia students — no delivery charges applied.
      </>
    ),
  },
  {
    icon: FaMapMarkerAlt,
    text: (
      <>
        Please mention your{" "}
        <span className="text-white font-semibold">exact gate number</span> for
        smooth and quick delivery. Supported gates:{" "}
        <span className="text-white font-semibold">Gate 1, Gate 7, Gate 8</span>{" "}
        and other campus entry points.
      </>
    ),
  },
  {
    icon: FaHome,
    text: (
      <>
        For hostel residents, mention your{" "}
        <span className="text-white font-semibold">hostel name clearly</span> in
        the address. Common hostels:{" "}
        <span className="text-white font-semibold">
          J&K Hostel, BHM Hostel, Boys Hostel
        </span>{" "}
        and other on-campus accommodations.
      </>
    ),
  },
  {
    icon: FaCalendarCheck,
    text: (
      <>
        Deliveries are available{" "}
        <span className="text-white font-semibold">every day</span> across four
        convenient time slots — choose the one that fits your schedule.
      </>
    ),
  },
  {
    icon: FaWhatsapp,
    text: (
      <>
        For urgent or custom orders, reach us directly on WhatsApp:{" "}
        <a
          href="https://wa.me/917982670413"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#17d492] font-black hover:underline"
        >
          +91 7982670413
        </a>
      </>
    ),
  },
];

const NON_JAMIA_DELIVERY_INFO = [
  {
    icon: FaTruck,
    text: (
      <>
        A <span className="text-white font-semibold">10% delivery charge</span>{" "}
        is applied on your order subtotal to cover delivery costs to your
        location.
      </>
    ),
  },
  {
    icon: FaMapMarkerAlt,
    text: (
      <>
        Please provide your{" "}
        <span className="text-white font-semibold">complete address</span>{" "}
        including house number, apartment/flat number, floor, and any nearby
        landmark for accurate delivery.
      </>
    ),
  },
  {
    icon: FaCalendarCheck,
    text: (
      <>
        Delivery is available in the{" "}
        <span className="text-white font-semibold">8:30 PM – 9:30 PM</span> time
        slot. Please ensure someone is available to receive the order.
      </>
    ),
  },
  {
    icon: FaPhoneAlt,
    text: (
      <>
        You will receive a{" "}
        <span className="text-white font-semibold">confirmation notification</span>{" "}
        before your order is dispatched for delivery.
      </>
    ),
  },
  {
    icon: FaWhatsapp,
    text: (
      <>
        For urgent orders or delivery queries, contact us on WhatsApp:{" "}
        <a
          href="https://wa.me/917982670413"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#17d492] font-black hover:underline"
        >
          +91 7982670413
        </a>
      </>
    ),
  },
];

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [isJamiaStudent, setIsJamiaStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [codSuccess, setCodSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [savedDetails, setSavedDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ── Load localStorage + scroll to top together ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSavedDetails(parsed);
        setForm(parsed.form || { name: "", phone: "", email: "", address: "" });
        setIsJamiaStudent(
          parsed.isJamiaStudent === true ? true : parsed.isJamiaStudent === false ? false : null
        );
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch {
      setIsEditing(true);
    }

    // Scroll after state is set so there's no layout jump
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }, []);

  // ── Scroll to top when order is placed successfully ──
  useEffect(() => {
    if (success) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [success]);

  useEffect(() => {
    if (isJamiaStudent === false && selectedSlot) {
      const slot = ALL_TIME_SLOTS.find((s) => s.time === selectedSlot);
      if (slot?.jamiaOnly) setSelectedSlot(null);
    }
    if (isJamiaStudent === false) {
      setSelectedSlot("20:30-21:30");
    }
  }, [isJamiaStudent]);

  const availableSlots =
    isJamiaStudent === false
      ? ALL_TIME_SLOTS.filter((s) => !s.jamiaOnly)
      : ALL_TIME_SLOTS;

  const saveToLocal = (formData, jamia) => {
    const payload = { form: formData, isJamiaStudent: jamia };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setSavedDetails(payload);
  };

  const handlePhoneChange = (val) => {
    const digits = val.replace(/\D/g, "");
    setForm({ ...form, phone: digits });
    if (digits.length > 0 && digits.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = isJamiaStudent === true ? 0 : Math.round(subtotal * 0.1);
  const platformFee = paymentMethod === "cod" ? COD_PLATFORM_FEE : 0;
  const grandTotal = subtotal + deliveryCharge + platformFee;

  const validateForm = () => {
    if (!form.name.trim()) { alert("Please enter your full name"); return false; }
    if (!form.phone.trim()) { alert("Please enter your phone number"); return false; }
    if (form.phone.replace(/\D/g, "").length !== 10) { alert("Please enter a valid 10-digit phone number"); return false; }
    if (!form.address.trim()) { alert("Please enter your delivery address"); return false; }
    if (isJamiaStudent === null) { alert("Please select whether you are a Jamia student"); return false; }
    if (!selectedSlot) { alert("Please select a delivery time slot"); return false; }
    return true;
  };

  const handleSaveDetails = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || isJamiaStudent === null) {
      alert("Please fill all required fields before saving");
      return;
    }
    if (form.phone.replace(/\D/g, "").length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    saveToLocal(form, isJamiaStudent);
    setIsEditing(false);
  };

  const extractOrderId = (data) => {
    return data?.orderId || data?.order_id || data?._id || data?.id || data?.orderNumber || "";
  };

  const handleCODOrder = async () => {
    if (!validateForm()) return;
    saveToLocal(form, isJamiaStudent);
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
          platformFee,
          deliverySlot: selectedSlot,
          paymentMethod: "cod",
          paymentStatus: "cod_pending",
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to place order");
      const oid = extractOrderId(orderData);
      setPlacedOrderId(oid);
      setCodSuccess(true);
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error("COD Order error:", err);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayClick = async () => {
    if (!validateForm()) return;
    if (!razorpayLoaded) { alert("Payment gateway is still loading, please try again."); return; }
    saveToLocal(form, isJamiaStudent);
    setLoading(true);
    try {
      const rzpRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal }),
      });
      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) throw new Error(rzpData.error || "Failed to initiate payment");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: "Kapil Store",
        description: "Stationery Order",
        image: "/image.png",
        order_id: rzpData.id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        notes: { address: form.address },
        theme: { color: "#17d492" },
        handler: async (response) => {
          const orderRes = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer: { ...form, isJamiaStudent },
              cart,
              total: grandTotal,
              deliveryCharge,
              platformFee,
              deliverySlot: selectedSlot,
              paymentMethod: "razorpay",
              paymentStatus: "paid",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const orderData = await orderRes.json();
          if (!orderRes.ok) {
            alert("Payment successful but order save failed. Please contact support with Payment ID: " + response.razorpay_payment_id);
            setLoading(false);
            return;
          }
          const oid = extractOrderId(orderData);
          setPlacedOrderId(oid);
          setCodSuccess(false);
          setSuccess(true);
          clearCart();
          setLoading(false);
        },
        modal: { ondismiss: () => setLoading(false) },
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

  // ── Success Screen ──
  if (success) {
    return (
      <div className="min-h-screen bg-[#22323c] text-[#f5f5f5] flex items-start justify-center px-4 pt-28">
        <div className="text-center max-w-sm w-full">
          <FaCheckCircle size={64} className="text-[#17d492] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#17d492] mb-2">Order Placed!</h2>
          {placedOrderId && (
            <p className="text-white/70 mb-1">
              Order ID: <span className="font-mono text-white">{placedOrderId}</span>
            </p>
          )}
          {selectedSlot && (
            <p className="text-[#17d492] text-sm mb-2 font-semibold flex items-center justify-center gap-1">
              <FaClock size={12} /> Delivery slot:{" "}
              {ALL_TIME_SLOTS.find((s) => s.time === selectedSlot)?.label}
            </p>
          )}
          {codSuccess ? (
            <>
              <p className="text-green-400 text-sm mb-2 font-semibold">Cash on Delivery — Pay when your order arrives.</p>
              <p className="text-white/50 text-sm mb-8">Keep ₹{grandTotal} ready. We'll contact you before delivery.</p>
            </>
          ) : (
            <>
              <p className="text-green-400 text-sm mb-2 font-semibold">Payment confirmed successfully.</p>
              <p className="text-white/50 text-sm mb-8">We'll contact you soon to confirm delivery.</p>
            </>
          )}
          <div className="flex flex-col gap-3">
            {placedOrderId && (
              <a href={`/track/${placedOrderId}`} className="bg-[#17d492] text-[#22323c] py-3 px-6 rounded-xl font-black hover:bg-[#14b87e] transition">
                Track Your Order
              </a>
            )}
            <a href="/" className="border-2 border-slate-700 text-slate-300 py-3 px-6 rounded-xl font-bold hover:bg-slate-800 transition">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  const deliveryInfo =
    isJamiaStudent === true ? JAMIA_DELIVERY_INFO : isJamiaStudent === false ? NON_JAMIA_DELIVERY_INFO : null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setRazorpayLoaded(true)} strategy="afterInteractive" />

      <div className="min-h-screen bg-[#22323c] text-[#f5f5f5] py-10 px-4 pt-28">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-black mb-8 text-[#17d492]">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* LEFT */}
            <div className="space-y-6">

              {/* Delivery Details */}
              <div className="bg-[#1a2830] rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-[#17d492]">Delivery Details</h2>
                  {savedDetails && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-[#17d492] transition px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#17d492]/40"
                    >
                      <FaEdit size={11} /> Edit
                    </button>
                  )}
                </div>

                {savedDetails && !isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <FaUserCheck size={14} className="text-[#17d492]" />
                      <span className="text-xs font-black text-[#17d492] uppercase tracking-wider">Saved Details</span>
                    </div>
                    <div className="bg-[#22323c] rounded-xl p-4 space-y-2.5 border border-[#17d492]/20">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Name</span>
                        <span className="text-white font-bold">{form.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Phone</span>
                        <span className="text-white font-bold">{form.phone}</span>
                      </div>
                      {form.email && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Email</span>
                          <span className="text-white font-bold truncate ml-4 text-right">{form.email}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 shrink-0">Jamia Campus Resident</span>
                        <span className={`font-bold ${isJamiaStudent ? "text-[#17d492]" : "text-slate-300"}`}>
                          {isJamiaStudent ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-white/5">
                        <span className="text-slate-500 text-xs block mb-1">Address</span>
                        <span className="text-white text-sm">{form.address}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <FaLock size={9} /> Details saved on this device — tap Edit to change
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 focus:outline-none focus:border-[#17d492] transition"
                    />
                    <div>
                      <div className={`flex items-center bg-[#22323c] border rounded-xl px-4 py-3 gap-2 transition ${
                        phoneError ? "border-red-500/60" : form.phone.length === 10 ? "border-[#17d492]/60" : "border-white/10 focus-within:border-[#17d492]"
                      }`}>
                        <span className="text-slate-500 text-sm shrink-0">+91</span>
                        <div className="w-px h-4 bg-white/10 shrink-0" />
                        <input
                          type="tel"
                          placeholder="10-digit phone number *"
                          value={form.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          maxLength={10}
                          className="flex-1 bg-transparent focus:outline-none text-white placeholder-slate-500 text-sm"
                        />
                        {form.phone.length === 10 && !phoneError && (
                          <FaCheckCircle size={13} className="text-[#17d492] shrink-0" />
                        )}
                      </div>
                      {phoneError && (
                        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                          {phoneError}
                        </p>
                      )}
                      {form.phone.length > 0 && form.phone.length < 10 && !phoneError && (
                        <p className="text-slate-500 text-xs mt-1.5">
                          {10 - form.phone.length} more digit{10 - form.phone.length !== 1 ? "s" : ""} required
                        </p>
                      )}
                    </div>
                    <input
                      type="email"
                      placeholder="Email (for order confirmation)"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 focus:outline-none focus:border-[#17d492] transition"
                    />
                    <div>
                      <p className="mb-2 font-bold text-[#17d492] text-sm">Are you residing on the Jamia campus? *</p>
                      <div className="flex gap-3">
                        {[
                          { val: true, label: "Yes " },
                          { val: false, label: "No " },
                        ].map((opt) => (
                          <label
                            key={String(opt.val)}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition text-sm font-bold ${
                              isJamiaStudent === opt.val
                                ? "border-[#17d492] bg-[#17d492]/10 text-[#17d492]"
                                : "border-white/10 text-slate-400 hover:border-white/30"
                            }`}
                          >
                            <input type="radio" name="jamia" className="hidden" onChange={() => setIsJamiaStudent(opt.val)} />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      placeholder={
                        isJamiaStudent === true ? "Hostel name / Gate number / Room number *"
                        : isJamiaStudent === false ? "House no. / Apartment / Floor / Landmark *"
                        : "Complete Address *"
                      }
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 focus:outline-none focus:border-[#17d492] transition"
                    />
                    <button
                      type="button"
                      onClick={handleSaveDetails}
                      className="w-full py-3 rounded-xl bg-[#17d492]/10 border border-[#17d492]/30 text-[#17d492] font-black text-sm hover:bg-[#17d492]/20 transition flex items-center justify-center gap-2"
                    >
                      <FaUserCheck size={13} /> Save Details
                    </button>
                  </div>
                )}
              </div>

              {/* Delivery Time Slot */}
              <div className="bg-[#1a2830] rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-black mb-1 text-[#17d492]">Delivery Time Slot</h2>
                <p className="text-xs text-slate-500 mb-4">
                  {isJamiaStudent === false ? "Outside Jamia deliveries are available in the evening slot only." : "Select your preferred delivery window *"}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                          isSelected ? "border-[#17d492] bg-[#17d492]/10" : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition ${isSelected ? "border-[#17d492]" : "border-slate-500"}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#17d492]" />}
                        </div>
                        <p className={`text-sm font-bold transition ${isSelected ? "text-white" : "text-slate-300"}`}>{slot.label}</p>
                      </button>
                    );
                  })}
                </div>
                {isJamiaStudent === null && (
                  <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                    <FaClock size={10} /> Select your student status above to see available time slots
                  </p>
                )}
                {isJamiaStudent !== null && !selectedSlot && (
                  <p className="mt-3 text-xs text-[#17d492]/70 flex items-center gap-1.5">
                    <FaClock size={10} /> Please select a time slot to continue
                  </p>
                )}
              </div>

              {/* Delivery Info */}
              {deliveryInfo ? (
                <div className="bg-[#1a2830] rounded-2xl p-6 border border-[#17d492]/20">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-black text-[#17d492]">Delivery Information</h2>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                      isJamiaStudent ? "bg-[#17d492]/15 text-[#17d492] border-[#17d492]/25" : "bg-slate-500/15 text-slate-400 border-slate-500/25"
                    }`}>
                      {isJamiaStudent ? "Jamia Campus" : "Outside Jamia"}
                    </span>
                  </div>
                  <ul className="space-y-3.5">
                    {deliveryInfo.map(({ icon: Icon, text }, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <Icon className="text-[#17d492] mt-0.5 shrink-0" size={15} />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-[#1a2830] rounded-2xl p-6 border border-white/5">
                  <h2 className="text-lg font-black text-[#17d492] mb-2">Delivery Information</h2>
                  <p className="text-sm text-slate-500">Please select your student status above to see personalised delivery instructions.</p>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-[#1a2830] rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-black mb-4 text-[#17d492]">Payment Method</h2>
                <div className="space-y-3">
                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === "cod" ? "border-[#17d492] bg-[#17d492]/10" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition ${paymentMethod === "cod" ? "border-[#17d492]" : "border-slate-500"}`}>
                      {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-[#17d492]" />}
                    </div>
                    <FaMoneyBillWave size={20} className={`shrink-0 mt-0.5 transition ${paymentMethod === "cod" ? "text-[#17d492]" : "text-slate-500"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-bold text-sm transition ${paymentMethod === "cod" ? "text-white" : "text-slate-400"}`}>Cash on Delivery</p>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#17d492]/15 text-[#17d492] border border-[#17d492]/25">+₹5 platform fee</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Pay in cash when your order arrives.</p>
                    </div>
                    {paymentMethod === "cod" && <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-[#17d492]/20 text-[#17d492] shrink-0">SELECTED</span>}
                  </div>

                  {/* Razorpay */}
                  <div
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === "razorpay" ? "border-[#17d492] bg-[#17d492]/10" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition ${paymentMethod === "razorpay" ? "border-[#17d492]" : "border-slate-500"}`}>
                      {paymentMethod === "razorpay" && <div className="w-2 h-2 rounded-full bg-[#17d492]" />}
                    </div>
                    <MdPayment size={20} className={`shrink-0 mt-0.5 transition ${paymentMethod === "razorpay" ? "text-[#17d492]" : "text-slate-500"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-bold text-sm transition ${paymentMethod === "razorpay" ? "text-white" : "text-slate-400"}`}>Pay Online — UPI / Cards / Net Banking</p>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#17d492]/15 text-[#17d492] border border-[#17d492]/20">No extra fee</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">GPay, PhonePe, Paytm, Credit/Debit Cards & more</p>
                    </div>
                    {paymentMethod === "razorpay" && <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-[#17d492]/20 text-[#17d492] shrink-0">SELECTED</span>}
                  </div>
                </div>

                {paymentMethod === "cod" && (
                  <div className="mt-3 flex items-center gap-2 bg-[#17d492]/8 border border-[#17d492]/20 rounded-xl px-4 py-3">
                    <FaMoneyBillWave size={13} className="text-[#17d492] shrink-0" />
                    <p className="text-xs text-[#17d492]/90">
                      Keep <span className="font-black">exact change of ₹{grandTotal}</span> ready (includes ₹5 platform fee). Delivery agent may not carry change.
                    </p>
                  </div>
                )}
                {paymentMethod === "razorpay" && (
                  <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <FaLock size={10} /> 256-bit SSL secured payment powered by Razorpay
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT — Order Summary */}
            <div className="bg-[#1a2830] rounded-2xl p-6 h-fit sticky top-28 border border-white/5">
              <h2 className="text-lg font-black mb-4 text-[#17d492]">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cart.length === 0 ? (
                  <p className="text-slate-400 text-sm">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.title}-${item.cartItemId}`} className="flex justify-between text-sm">
                      <span className="text-white/70">{item.title} × {item.quantity}</span>
                      <span className="text-white">₹{item.price * item.quantity}</span>
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
                  <span className="text-slate-400 flex items-center gap-1.5">
                    Delivery
                    {isJamiaStudent === true && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#17d492]/15 text-[#17d492] border border-[#17d492]/20">FREE</span>
                    )}
                    {isJamiaStudent === false && <span className="text-xs text-slate-600">(10%)</span>}
                  </span>
                  <span className={isJamiaStudent === true ? "text-[#17d492] font-black" : ""}>
                    {isJamiaStudent === true ? "₹0" : `₹${deliveryCharge}`}
                  </span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-[#17d492]">
                    <span className="flex items-center gap-1.5">
                      Platform Fee
                      <span className="text-[10px] bg-[#17d492]/15 border border-[#17d492]/20 px-1.5 py-0.5 rounded font-black">COD</span>
                    </span>
                    <span>₹{COD_PLATFORM_FEE}</span>
                  </div>
                )}
                {selectedSlot && (
                  <div className="flex justify-between text-[#17d492] text-xs pt-1">
                    <span className="flex items-center gap-1"><FaClock size={10} /> Delivery slot</span>
                    <span className="font-bold">{ALL_TIME_SLOTS.find((s) => s.time === selectedSlot)?.label}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-[#17d492]">₹{grandTotal}</span>
                </div>
              </div>

              {!selectedSlot ? (
                <div className="mt-4 flex items-center gap-2 bg-[#17d492]/8 border border-[#17d492]/20 rounded-xl px-4 py-3">
                  <FaClock size={13} className="text-[#17d492] shrink-0" />
                  <p className="text-xs text-[#17d492]/80 font-semibold">Select a delivery time slot to place your order</p>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 bg-[#17d492]/5 border border-[#17d492]/15 rounded-xl px-4 py-3">
                  <FaClock size={13} className="text-[#17d492] shrink-0" />
                  <p className="text-xs text-slate-400">
                    Delivering at <span className="text-white font-bold">{ALL_TIME_SLOTS.find((s) => s.time === selectedSlot)?.label}</span>
                  </p>
                </div>
              )}

              <button
                onClick={paymentMethod === "cod" ? handleCODOrder : handlePayClick}
                disabled={loading || cart.length === 0 || !selectedSlot}
                className={`w-full mt-5 py-4 rounded-xl font-black transition text-[#22323c] ${
                  loading || cart.length === 0 || !selectedSlot
                    ? "bg-[#17d492]/50 cursor-not-allowed"
                    : "bg-[#17d492] hover:bg-[#14b87e] hover:-translate-y-0.5 active:scale-95 shadow-[0_10px_20px_-10px_rgba(23,212,146,0.4)]"
                }`}
              >
                {loading ? "Processing..."
                  : !selectedSlot ? "Select a Time Slot First"
                  : paymentMethod === "cod" ? `Place Order — Pay ₹${grandTotal} on Delivery`
                  : `Pay ₹${grandTotal} Securely`}
              </button>

              <p className="text-xs text-center mt-3 text-slate-600 flex items-center justify-center gap-1">
                <FaLock size={9} />{" "}
                {paymentMethod === "cod" ? "No advance payment required" : "Secure Checkout powered by Razorpay"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}