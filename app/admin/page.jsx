"use client";

import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [tab, setTab] = useState("orders");
  const [adminKey, setAdminKey] = useState("");
  const [authorized, setAuthorized] = useState(false);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#22323c]">
        <div className="bg-[#1a2830] p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/5">
          <h2 className="text-2xl font-black text-[#17d492] mb-6">
            Admin Login
          </h2>
          <input
            type="password"
            placeholder="Enter Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && adminKey && setAuthorized(true)
            }
            className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492] mb-4 transition"
          />
          <button
            onClick={() => adminKey && setAuthorized(true)}
            className="w-full bg-[#17d492] text-[#22323c] py-3 rounded-xl font-black hover:bg-[#14b87e] transition"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "orders", label: "📦 Orders" },
    { id: "add-product", label: "➕ Add Product" },
    { id: "view-products", label: "🗂️ Products" },
    { id: "pyqs", label: "📚 PYQs" },
  ];

  return (
    <div className="min-h-screen bg-[#22323c] text-[#f5f5f5] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-black text-[#17d492] mb-8">Admin Panel</h1>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl font-black text-sm whitespace-nowrap transition ${
                tab === t.id
                  ? "bg-[#17d492] text-[#22323c]"
                  : "bg-[#1a2830] text-white border border-white/10 hover:border-[#17d492]/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "orders" && <OrdersDashboard adminKey={adminKey} />}
        {tab === "add-product" && <ProductsDashboard adminKey={adminKey} />}
        {tab === "view-products" && <ViewProducts adminKey={adminKey} />}
        {tab === "pyqs" && <PYQDashboard adminKey={adminKey} />}
      </div>
    </div>
  );
}

/* ============================================================
   VARIANTS EDITOR
   ============================================================ */
function VariantsEditor({ variants = [], onChange }) {
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");

  const add = () => {
    if (!label || !price) return;
    onChange([...variants, { label, price: Number(price), mrp: mrp ? Number(mrp) : undefined }]);
    setLabel(""); setPrice(""); setMrp("");
  };

  const remove = (i) => onChange(variants.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="text-xs text-slate-400 mb-2 block font-black uppercase tracking-wider">
        Variants / Options{" "}
        <span className="text-amber-400 normal-case font-normal">(optional — e.g. 100 pages, 200 pages)</span>
      </label>

      {variants.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-[#22323c] border border-[#17d492]/30 rounded-xl px-3 py-1.5">
              <span className="text-xs font-black text-white">{v.label}</span>
              <span className="text-xs text-[#17d492] font-bold">₹{v.price}</span>
              {v.mrp && <span className="text-xs text-slate-500 line-through">₹{v.mrp}</span>}
              <button onClick={() => remove(i)} className="text-red-400 text-xs ml-1 hover:text-red-300 font-black">✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <input
          placeholder='Label (e.g. "100 Pages")'
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="flex-1 min-w-[120px] px-3 py-2 rounded-xl bg-[#22323c] border border-white/10 text-white text-sm focus:outline-none focus:border-[#17d492]"
        />
        <input
          type="number"
          placeholder="Price ₹"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-24 px-3 py-2 rounded-xl bg-[#22323c] border border-white/10 text-white text-sm focus:outline-none focus:border-[#17d492]"
        />
        <input
          type="number"
          placeholder="MRP ₹"
          value={mrp}
          onChange={(e) => setMrp(e.target.value)}
          className="w-24 px-3 py-2 rounded-xl bg-[#22323c] border border-white/10 text-white text-sm focus:outline-none focus:border-[#17d492]"
        />
        <button
          type="button"
          onClick={add}
          disabled={!label || !price}
          className="px-4 py-2 rounded-xl bg-[#17d492]/20 border border-[#17d492]/40 text-[#17d492] text-sm font-black hover:bg-[#17d492]/30 transition disabled:opacity-30"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   ORDERS
   ============================================================ */
function OrdersDashboard({ adminKey }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [trackingModal, setTrackingModal] = useState(null);
  const [trackForm, setTrackForm] = useState({
    status: "confirmed",
    message: "",
    lat: "",
    lng: "",
  });

  const STATUS_LABELS = {
    placed: "Placed",
    confirmed: "Confirmed",
    preparing: "Preparing",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  const STATUS_COLORS = {
    placed: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    preparing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    out_for_delivery: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    delivered: "bg-[#17d492]/20 text-[#17d492] border-[#17d492]/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (orderId) => {
    if (!confirm("Mark this order as completed and remove it?")) return;
    await fetch("/api/admin/orders/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ orderId }),
    });
    load();
  };

  const updateTracking = async () => {
    const res = await fetch("/api/admin/orders/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({
        orderId: trackingModal,
        ...trackForm,
        lat: trackForm.lat ? parseFloat(trackForm.lat) : undefined,
        lng: trackForm.lng ? parseFloat(trackForm.lng) : undefined,
      }),
    });
    if (res.ok) {
      setTrackingModal(null);
      load();
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#17d492] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          "all",
          "placed",
          "confirmed",
          "preparing",
          "out_for_delivery",
          "delivered",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap uppercase tracking-wider transition ${
              filter === s
                ? "bg-[#17d492] text-[#22323c]"
                : "bg-[#1a2830] text-slate-400 border border-white/10 hover:border-[#17d492]/30"
            }`}
          >
            {s === "all" ? `All (${orders.length})` : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-[#1a2830] rounded-2xl border border-white/5">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-slate-400 font-bold">No orders found</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((order) => (
          <div
            key={order.orderId}
            className="bg-[#1a2830] rounded-2xl p-5 border border-white/5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-black text-white">#{order.orderId}</p>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${STATUS_COLORS[order.status] || "bg-white/10 text-white border-white/20"}`}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      order.category === "groceries"
                        ? "bg-green-500/20 text-green-400"
                        : order.category === "mixed"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {order.category || "stationery"}
                  </span>
                  {order.paymentMethod === "razorpay" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#17d492]/20 text-[#17d492] font-bold">
                      💳 Paid
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(order.timestamp || order.createdAt).toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setTrackingModal(order.orderId);
                    setTrackForm({
                      status: order.status || "confirmed",
                      message: "",
                      lat: "",
                      lng: "",
                    });
                  }}
                  className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition font-bold"
                >
                  📍 Update Tracking
                </button>
                <a
                  href={`/track/${order.orderId}`}
                  target="_blank"
                  className="text-xs bg-[#17d492]/10 text-[#17d492] border border-[#17d492]/30 px-3 py-1.5 rounded-lg hover:bg-[#17d492]/20 transition font-bold"
                >
                  🗺️ Live Track
                </a>
                <button
                  onClick={() => markCompleted(order.orderId)}
                  className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition font-bold"
                >
                  ✓ Complete
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-bold">
                  Customer
                </p>
                <p className="font-bold text-white">{order.customer?.name}</p>
                <a href={`https://wa.me/91${order.customer?.phone}`}
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm text-green-400 font-bold hover:text-green-300 flex items-center gap-1 transition"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.215a.75.75 0 0 0 .921.921l5.356-1.476A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.212-3.681 1.015 1.015-3.681-.212-.355A9.713 9.713 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
  {order.customer?.phone}
</a>
                <p className="text-sm text-slate-400">
                  {order.customer?.email}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {order.customer?.address}
                </p>
                {order.customer?.isJamiaStudent && (
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <span className="text-xs text-[#17d492] bg-[#17d492]/10 px-2 py-0.5 rounded-full font-bold">
                      Jamia Student
                    </span>
                    {order.customer?.timeSlot && (
                      <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                        🕐 {order.customer.timeSlot}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-bold">
                  Items
                </p>
                {order.items?.map((item, i) => (
                  <div key={i}>
                    <p className="text-sm font-bold text-white">
                      {item.title} × {item.quantity} = ₹
                      {item.price * item.quantity}
                    </p>
                    {item.description && (
                      <p className="text-xs text-slate-500">
                        ↳ {item.description}
                      </p>
                    )}
                  </div>
                ))}
                <div className="flex gap-4 mt-2 pt-2 border-t border-white/5">
                  <p className="text-sm font-black text-[#17d492]">
                    Total: ₹{order.totalAmount}
                  </p>
                  <p className="text-sm text-slate-500">
                    Delivery: ₹{order.deliveryCharge}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {trackingModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={() => setTrackingModal(null)}
        >
          <div
            className="bg-[#1a2830] rounded-2xl p-6 w-full max-w-md border border-[#17d492]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-[#17d492] mb-5">
              Update Tracking – #{trackingModal}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={trackForm.status}
                  onChange={(e) =>
                    setTrackForm({ ...trackForm, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
                >
                  {[
                    "placed",
                    "confirmed",
                    "preparing",
                    "out_for_delivery",
                    "delivered",
                    "cancelled",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
                  Custom Message (optional)
                </label>
                <input
                  placeholder="e.g. Out for delivery from Gate 7"
                  value={trackForm.message}
                  onChange={(e) =>
                    setTrackForm({ ...trackForm, message: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
                    Latitude
                  </label>
                  <input
                    type="number"
                    placeholder="28.5600"
                    value={trackForm.lat}
                    onChange={(e) =>
                      setTrackForm({ ...trackForm, lat: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
                    Longitude
                  </label>
                  <input
                    type="number"
                    placeholder="77.2700"
                    value={trackForm.lng}
                    onChange={(e) =>
                      setTrackForm({ ...trackForm, lng: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                💡 Enter delivery partner's GPS coordinates to show live
                location on map
              </p>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={updateTracking}
                className="flex-1 bg-[#17d492] text-[#22323c] py-3 rounded-xl font-black hover:bg-[#14b87e] transition"
              >
                Update
              </button>
              <button
                onClick={() => setTrackingModal(null)}
                className="flex-1 border border-white/20 py-3 rounded-xl font-bold hover:bg-white/5 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ALL CATEGORIES CONFIG
   ============================================================ */
const ALL_CATEGORIES = [
  {
    id: "stationery",
    label: "✏️ Stationery",
    priceOptional: false,
    subs: [
      { id: "books-notebooks", label: "Books & Notebooks" },
      { id: "calculators", label: "Calculators" },
      { id: "drawing-materials", label: "Drawing Materials" },
      { id: "pens", label: "Pens (All Types)" },
      { id: "files-folders", label: "Files & Folders" },
      { id: "btech-polytechnic", label: "BTech & Polytechnic Materials" },
      { id: "xerox-printout", label: "Xerox / Printout" },
      { id: "jamia-school", label: "Jamia School Material" },
      { id: "other-stationery", label: "Other Stationery" },
    ],
  },
  {
    id: "assignment",
    label: "📝 Assignment Services",
    priceOptional: true,
    subs: [
      { id: "ignou-assignment", label: "IGNOU Assignment Work" },
      { id: "handwritten", label: "Handwritten Assignments" },
      { id: "typed", label: "Typed Assignments" },
      { id: "project-work", label: "Project Work" },
      { id: "ppt", label: "Presentation (PPT) Making" },
      { id: "engineering-drawing", label: "Engineering Drawing" },
      { id: "polytechnic-drawing", label: "Polytechnic Drawing" },
      { id: "thesis", label: "Thesis Help" },
      { id: "school-assignment", label: "School Assignment" },
      { id: "college-assignment", label: "College Assignment" },
      { id: "drawing-work", label: "Drawing Work" },
      { id: "important-questions", label: "Important Questions Solving" },
    ],
  },
  {
    id: "tuition",
    label: "🎓 Tuition Services",
    priceOptional: true,
    subs: [
      { id: "school-tuition", label: "School Tuition Available" },
      { id: "college-tuition", label: "College Tuition Available" },
      { id: "home-tuition", label: "Home Tuition Available" },
      { id: "entrance-exam", label: "Entrance Exam Preparation" },
      { id: "tutor-available", label: "Tutor Available" },
      { id: "ignou-help", label: "IGNOU Help" },
      { id: "exam-form", label: "Exam Form Filling" },
      { id: "online-form", label: "Online Form Filling Service" },
    ],
  },
  {
    id: "earn-rent",
    label: "🏠 Earn & Rent Hub",
    priceOptional: true,
    subs: [
      { id: "calculators-rent", label: "Calculators on Rent" },
      { id: "pg-rooms", label: "PG / Rooms on Rent" },
      { id: "electronics-rent", label: "Electronics on Rent" },
      { id: "room-essentials", label: "Room Essentials on Rent" },
      { id: "travel-transport", label: "Travel & Transport on Rent" },
      { id: "daily-items-rent", label: "Daily Use Items on Rent" },
      { id: "money-rent", label: "Money on Rent" },
    ],
  },
  {
    id: "others",
    label: "⚡ Others",
    priceOptional: true,
    subs: [
      { id: "ironing", label: "Clothes Ironing" },
      { id: "laundry", label: "Laundry Service" },
      { id: "dry-cleaning", label: "Dry Cleaning" },
      { id: "resume", label: "Resume / CV Making" },
      { id: "recharge", label: "Mobile Recharge & Bill Payment" },
      { id: "laptop-repair", label: "Laptop / Mobile Repair" },
      { id: "packing-shifting", label: "Packing & Shifting Help" },
      { id: "printout-scan", label: "Printout / Scan Service" },
      { id: "id-card", label: "ID Card / Document Help" },
      { id: "shoes-bags", label: "Shoes & Bags" },
      { id: "utensils", label: "Utensils Services" },
      { id: "clothes", label: "Clothes Section" },
      { id: "chemist", label: "Chemist & Cosmetics" },
      { id: "pyq", label: "PYQ Section" },
    ],
  },
];

/* ============================================================
   ADD PRODUCT
   ============================================================ */
function ProductsDashboard({ adminKey }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    actualPrice: "",
    unit: "",
    images: [],
    category: "stationery",
    subcategory: "",
    variants: [],
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeCat = ALL_CATEGORIES.find((c) => c.id === form.category);
  const isPriceOptional = activeCat?.priceOptional || false;

  async function uploadImages(files) {
  setUploading(true);
  const urls = [];
  for (const file of files) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "products");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_NEW_CLOUD_NAME/image/upload",
      { method: "POST", body: data },
    );
    const json = await res.json();
    console.log("Cloudinary response:", JSON.stringify(json)); // ← ADD THIS
    if (!res.ok) {
      alert("Upload error: " + JSON.stringify(json.error)); // ← CHANGED THIS
      continue;
    }
    urls.push(json.secure_url);
  }
  setUploading(false);
  return urls;
}

 async function handleSubmit(e) {
    e.preventDefault();

    // ✅ Fixed: price is only required if:
    // 1. category is NOT price-optional (e.g. stationery)
    // 2. AND no variants have been added (variants have their own prices)
    // 3. AND price field is empty
    const priceRequired = !isPriceOptional && form.variants.length === 0 && !form.price;

    if (priceRequired) {
      alert("Please enter a price, or add variants with prices instead.");
      return;
    }

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({
        ...form,
        price: form.price ? Number(form.price) : 0,
        actualPrice: form.actualPrice ? Number(form.actualPrice) : undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert("❌ Failed: " + data.error);
      return;
    }
    setSuccess(true);
    setForm({
      title: "",
      description: "",
      price: "",
      actualPrice: "",
      unit: "",
      images: [],
      category: "stationery",
      subcategory: "",
      variants: [],
    });
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-black text-[#17d492] mb-6">
        Add New Product / Service
      </h2>

      {success && (
        <div className="mb-4 bg-[#17d492]/10 border border-[#17d492]/30 text-[#17d492] rounded-xl px-4 py-3 font-bold">
          ✅ Added successfully!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-[#1a2830] rounded-2xl p-6 space-y-5 border border-white/5"
      >
        {/* Category grid */}
        <div>
          <label className="text-xs text-slate-400 mb-2 block font-black uppercase tracking-wider">
            Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setForm({ ...form, category: cat.id, subcategory: "" })
                }
                className={`px-3 py-2.5 rounded-xl text-xs font-black border transition text-left leading-tight ${
                  form.category === cat.id
                    ? "border-[#17d492] bg-[#17d492]/15 text-[#17d492]"
                    : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory */}
        {activeCat?.subs?.length > 0 && (
          <div>
            <label className="text-xs text-slate-400 mb-1 block font-black uppercase tracking-wider">
              Subcategory *
            </label>
            <select
              required
              value={form.subcategory}
              onChange={(e) =>
                setForm({ ...form, subcategory: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
            >
              <option value="">Select subcategory</option>
              {activeCat.subs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block font-black uppercase tracking-wider">
            Title *
          </label>
          <input
            placeholder={
              form.category === "stationery"
                ? "e.g. Classmate Notebook 200 Pages"
                : form.category === "assignment"
                  ? "e.g. IGNOU Assignment – BCA 1st Year"
                  : form.category === "food"
                    ? "e.g. Chicken Biryani (Full)"
                    : "Product / Service Name"
            }
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block font-black uppercase tracking-wider">
            Description
          </label>
          <textarea
            placeholder="Describe the product or service..."
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
          />
        </div>

        {/* Price */}
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="text-xs text-slate-400 mb-1 block font-black uppercase tracking-wider">
      Price ₹{" "}
      {isPriceOptional ? (
        <span className="text-amber-400 normal-case">(optional)</span>
      ) : (
        "*"
      )}
    </label>
    <input
      type="number"
      placeholder={isPriceOptional ? "Leave blank = Contact us" : "e.g. 99"}
      value={form.price}
      onChange={(e) => setForm({ ...form, price: e.target.value })}
      className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
    />
  </div>
  <div>
    <label className="text-xs text-slate-400 mb-1 block font-black uppercase tracking-wider">
      MRP ₹ (optional)
    </label>
    <input
      type="number"
      placeholder="Original price"
      value={form.actualPrice}
      onChange={(e) => setForm({ ...form, actualPrice: e.target.value })}
      className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
    />
  </div>
</div>

{/* Variants */}
<VariantsEditor
  variants={form.variants}
  onChange={(variants) => setForm({ ...form, variants })}
/>

        {/* Unit */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block font-black uppercase tracking-wider">
            Unit / Quantity (optional)
          </label>
          <input
            placeholder="e.g. Pack of 5 · 500g · Per Page · Per Hour · Per Session"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
          />
        </div>

        {/* Images */}
        <div>
          <label className="text-xs text-slate-400 mb-2 block font-black uppercase tracking-wider">
            Images (optional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={async (e) => {
              const urls = await uploadImages(e.target.files);
              setForm({ ...form, images: urls });
            }}
            className="text-sm text-slate-400"
          />
          {form.images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {form.images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-16 h-16 object-cover rounded-xl border border-[#17d492]/30"
                />
              ))}
            </div>
          )}
        </div>

        {isPriceOptional && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-400 font-bold">
            💡 Price is optional for this category — if left blank, listing will
            show "Contact for Price"
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-[#17d492] text-[#22323c] py-3.5 rounded-xl font-black hover:bg-[#14b87e] transition disabled:opacity-50"
        >
          {uploading ? "Uploading Images..." : "Add Product / Service"}
        </button>
      </form>
    </div>
  );
}

/* ============================================================
   VIEW PRODUCTS
   ============================================================ */
function ViewProducts({ adminKey }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/admin/products/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ id }),
    });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  const CAT_FILTER_BTNS = [
    { id: "all", label: `All` },
    ...ALL_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  const CAT_COLOR = {
    stationery: "bg-blue-500/20 text-blue-400",
    assignment: "bg-purple-500/20 text-purple-400",
    tuition: "bg-cyan-500/20 text-cyan-400",
    "earn-rent": "bg-pink-500/20 text-pink-400",
    others: "bg-[#17d492]/20 text-[#17d492]",
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#17d492] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div>
      {/* Filter pills — scrollable */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CAT_FILTER_BTNS.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap uppercase tracking-wider transition shrink-0 ${
              filter === c.id
                ? "bg-[#17d492] text-[#22323c]"
                : "bg-[#1a2830] text-slate-400 border border-white/10 hover:border-[#17d492]/30"
            }`}
          >
            {c.id === "all"
              ? `All (${products.length})`
              : `${c.label} (${products.filter((p) => p.category === c.id).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-[#1a2830] rounded-2xl border border-white/5">
          <p className="text-slate-400 font-bold">No products found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product) => {
          const subLabel = ALL_CATEGORIES.find(
            (c) => c.id === product.category,
          )?.subs?.find((s) => s.id === product.subcategory)?.label;
          return (
            <div
              key={product._id}
              className="bg-[#1a2830] border border-white/5 rounded-2xl p-4 flex flex-col hover:border-[#17d492]/20 transition"
            >
              <div className="w-full h-40 bg-[#22323c] rounded-xl overflow-hidden mb-3">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-sm text-white flex-1 line-clamp-2">
                  {product.title}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-bold ${CAT_COLOR[product.category] || "bg-white/10 text-white"}`}
                >
                  {product.category}
                </span>
              </div>
              {subLabel && (
                <p className="text-xs text-slate-500 mb-2">{subLabel}</p>
              )}
              <div className="flex items-center gap-2 mt-auto mb-3">
                <span className="font-black text-[#17d492]">
                  {product.price > 0 ? `₹${product.price}` : "Contact"}
                </span>
                {product.actualPrice > 0 && (
                  <span className="text-xs text-slate-500 line-through">
                    ₹{product.actualPrice}
                  </span>
                )}
                {product.unit && (
                  <span className="text-xs text-slate-500">{product.unit}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="w-full border border-red-500/30 text-red-400 py-2 rounded-xl text-sm font-bold hover:bg-red-500/10 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingProduct(product)}
                  className="w-full border border-[#17d492]/30 text-[#17d492] py-2 rounded-xl text-sm font-bold hover:bg-[#17d492]/10 transition"
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          adminKey={adminKey}
          onClose={() => setEditingProduct(null)}
          onSuccess={load}
        />
      )}
    </div>
  );
}

/* ============================================================
   EDIT PRODUCT MODAL
   ============================================================ */
function EditProductModal({ product, adminKey, onClose, onSuccess }) {
  const [form, setForm] = useState(product);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(product);
  }, [product]);

  const activeCat = ALL_CATEGORIES.find((c) => c.id === form.category);
  const isPriceOptional = activeCat?.priceOptional || false;

  const handleUpdate = async () => {
    setLoading(true);
    const { _id, ...rest } = form;
    const res = await fetch("/api/admin/products/update", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ id: product._id, ...rest }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      alert("❌ " + data.error);
      return;
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a2830] p-6 rounded-2xl w-full max-w-lg border border-[#17d492]/20 overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-black text-[#17d492] mb-4">Edit Product</h2>

        {/* Category */}
        <label className="text-xs text-slate-400 mb-2 block font-black uppercase tracking-wider">
          Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                setForm({ ...form, category: cat.id, subcategory: "" })
              }
              className={`px-3 py-2 rounded-xl text-xs font-black border transition text-left leading-tight ${
                form.category === cat.id
                  ? "border-[#17d492] bg-[#17d492]/15 text-[#17d492]"
                  : "border-white/10 text-slate-400 hover:border-white/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Subcategory */}
        {activeCat?.subs?.length > 0 && (
          <select
            value={form.subcategory || ""}
            onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
            className="w-full mb-3 px-4 py-2 rounded-xl bg-[#22323c] text-white border border-white/10 focus:outline-none focus:border-[#17d492]"
          >
            <option value="">Select subcategory</option>
            {activeCat.subs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        )}

        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="w-full mb-3 px-4 py-2 rounded-xl bg-[#22323c] text-white border border-white/10 focus:outline-none focus:border-[#17d492]"
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="number"
            value={form.price || ""}
            placeholder={isPriceOptional ? "Price (optional)" : "Price ₹"}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            className="w-full px-4 py-2 rounded-xl bg-[#22323c] text-white border border-white/10 focus:outline-none focus:border-[#17d492]"
          />
          <input
            type="number"
            value={form.actualPrice || ""}
            placeholder="MRP ₹"
            onChange={(e) =>
              setForm({ ...form, actualPrice: Number(e.target.value) })
            }
            className="w-full px-4 py-2 rounded-xl bg-[#22323c] text-white border border-white/10 focus:outline-none focus:border-[#17d492]"
          />
        </div>

        <input
          value={form.unit || ""}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          placeholder="Unit (e.g. 500g · Per Hour)"
          className="w-full mb-3 px-4 py-2 rounded-xl bg-[#22323c] text-white border border-white/10 focus:outline-none focus:border-[#17d492]"
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          placeholder="Description"
          className="w-full mb-4 px-4 py-2 rounded-xl bg-[#22323c] text-white border border-white/10 focus:outline-none focus:border-[#17d492]"
        />

        <div className="flex gap-3">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-[#17d492] text-[#22323c] py-2.5 rounded-xl font-black hover:bg-[#14b87e] transition"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-white/20 py-2.5 rounded-xl text-white hover:bg-white/5 transition font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PYQ DASHBOARD
   ============================================================ */

function PYQDashboard({ adminKey }) {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [openDept, setOpenDept] = useState(null);
  const [success, setSuccess] = useState(false);
  const [linkError, setLinkError] = useState("");

  const [form, setForm] = useState({
    department: "",
    customDept: "",
    branch: "",
    subject: "",
    subjectCode: "",
    year: "",
    pdfUrl: "", // Will store the Google Drive share link
  });

  const DEPARTMENTS = [
    "Computer Science & Engineering",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Information Technology",
    "Other",
  ];
  const YEARS = [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
  ];

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pyqs", {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      setPyqs(Array.isArray(data) ? data : []);
    } catch {
      setPyqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    const depts = [...new Set(pyqs.map((p) => p.department))];
    if (depts.length > 0 && !openDept) setOpenDept(depts[0]);
  }, [pyqs]);

  // Convert Google Drive share link → direct download link
  const getDriveDownloadUrl = (url) => {
    const match = url?.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url; // return as-is if not a Drive link
  };

  // Validate Google Drive link
  const validateDriveLink = (url) => {
    if (!url) return "Please paste a Google Drive link";
    if (!url.includes("drive.google.com"))
      return "Must be a Google Drive link (drive.google.com)";
    if (!url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/))
      return "Invalid Drive link format. Share the file and paste the link.";
    return null;
  };

  const handleLinkChange = (val) => {
    setForm({ ...form, pdfUrl: val });
    if (val) setLinkError(validateDriveLink(val) || "");
    else setLinkError("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const finalDept =
      form.department === "Other" ? form.customDept : form.department;
    if (!finalDept) {
      alert("Please enter a department name");
      return;
    }

    const err = validateDriveLink(form.pdfUrl);
    if (err) {
      setLinkError(err);
      return;
    }

    // Store the download URL (converted from share link)
    const downloadUrl = getDriveDownloadUrl(form.pdfUrl);

    const res = await fetch("/api/admin/pyqs", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({
        ...form,
        pdfUrl: downloadUrl,
        department: finalDept,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert("❌ Failed: " + data.error);
      return;
    }

    setSuccess(true);
    setForm({
      department: "",
      customDept: "",
      branch: "",
      subject: "",
      subjectCode: "",
      year: "",
      pdfUrl: "",
    });
    setLinkError("");
    setTimeout(() => setSuccess(false), 3000);
    setView("list");
    load();
  };

  const deletePYQ = async (id) => {
    if (!confirm("Delete this PYQ?")) return;
    await fetch("/api/admin/pyqs/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const grouped = pyqs.reduce((acc, pyq) => {
    if (!acc[pyq.department]) acc[pyq.department] = [];
    acc[pyq.department].push(pyq);
    return acc;
  }, {});
  const departments = Object.keys(grouped);

  const fileNamePreview =
    form.branch && form.subject && form.subjectCode
      ? `${form.branch} - ${form.subject} - ${form.subjectCode}`
      : null;

  // Check if link is valid Drive link
  const isDriveValid = form.pdfUrl && !validateDriveLink(form.pdfUrl);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#17d492]">
          PYQ Manager
          {pyqs.length > 0 && (
            <span className="ml-2 text-sm font-bold text-slate-400">
              ({pyqs.length} files)
            </span>
          )}
        </h2>
        <button
          onClick={() => setView(view === "add" ? "list" : "add")}
          className={`px-5 py-2.5 rounded-xl font-black text-sm transition ${
            view === "add"
              ? "bg-white/10 text-white border border-white/20 hover:bg-white/15"
              : "bg-[#17d492] text-[#22323c] hover:bg-[#14b87e]"
          }`}
        >
          {view === "add" ? "← Back to List" : "+ Add PYQ"}
        </button>
      </div>

      {success && (
        <div className="mb-5 bg-[#17d492]/10 border border-[#17d492]/30 text-[#17d492] rounded-xl px-4 py-3 font-bold">
          ✅ PYQ added successfully!
        </div>
      )}

      {/* ── ADD FORM ── */}
      {view === "add" && (
        <form
          onSubmit={handleAdd}
          className="bg-[#1a2830] rounded-2xl p-6 border border-white/5 max-w-xl space-y-4"
        >
          {/* How to guide */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-xs text-blue-300 space-y-1.5">
            <p className="font-black text-blue-200 text-sm mb-2">
              How to add a PYQ:
            </p>
            <p>1. Upload the PDF to your Google Drive</p>
            <p>
              2. Right-click the file → <strong>Share</strong> →{" "}
              <strong>Anyone with the link</strong> → Copy link
            </p>
            <p>3. Paste the link below</p>
          </div>

          {/* Department */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
              Department *
            </label>
            <select
              required
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value, customDept: "" })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {form.department === "Other" && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
                Custom Department Name *
              </label>
              <input
                placeholder="e.g. Biotechnology"
                required
                value={form.customDept}
                onChange={(e) =>
                  setForm({ ...form, customDept: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
              />
            </div>
          )}

          {/* Branch */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
              Branch *
            </label>
            <input
              placeholder="e.g. CSE, ECE, ME"
              required
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
            />
          </div>

          {/* Subject + Code */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
                Subject Name *
              </label>
              <input
                placeholder="e.g. Data Structures"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
                Subject Code *
              </label>
              <input
                placeholder="e.g. CS301"
                required
                value={form.subjectCode}
                onChange={(e) =>
                  setForm({ ...form, subjectCode: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
              />
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
              Year *
            </label>
            <select
              required
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492]"
            >
              <option value="">Select Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Filename preview */}
          {fileNamePreview && (
            <div className="bg-[#17d492]/5 border border-[#17d492]/20 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                File Name Preview
              </p>
              <p className="text-sm font-black text-[#17d492]">
                {fileNamePreview}
              </p>
            </div>
          )}

          {/* Google Drive Link */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block font-bold uppercase tracking-wider">
              Google Drive Link *
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={form.pdfUrl}
              onChange={(e) => handleLinkChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-[#22323c] border text-white text-sm focus:outline-none transition ${
                linkError
                  ? "border-red-500/50 focus:border-red-500"
                  : isDriveValid
                    ? "border-[#17d492]/50 focus:border-[#17d492]"
                    : "border-white/10 focus:border-[#17d492]"
              }`}
            />
            {linkError && (
              <p className="text-red-400 text-xs mt-1 font-bold">{linkError}</p>
            )}
            {isDriveValid && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-[#17d492] text-xs font-bold">
                  ✓ Valid Google Drive link
                </p>
                <a
                  href={form.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#17d492]/60 underline hover:text-[#17d492] transition"
                >
                  Test link →
                </a>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!!linkError || !form.pdfUrl}
            className="w-full bg-[#17d492] text-[#22323c] py-3 rounded-xl font-black hover:bg-[#14b87e] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add PYQ
          </button>
        </form>
      )}

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <>
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#17d492] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && pyqs.length === 0 && (
            <div className="text-center py-20 bg-[#1a2830] rounded-2xl border border-white/5">
              <p className="text-slate-400 font-bold text-lg mb-1">
                No PYQs added yet.
              </p>
              <p className="text-slate-600 text-sm">
                Click "+ Add PYQ" to get started.
              </p>
            </div>
          )}

          {!loading && departments.length > 0 && (
            <div className="space-y-3">
              {departments.map((dept) => {
                const isOpen = openDept === dept;
                const items = grouped[dept];
                return (
                  <div
                    key={dept}
                    className="rounded-2xl border border-white/5 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenDept(isOpen ? null : dept)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-[#1a2830] hover:bg-[#1e3040] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#17d492]/10 border border-[#17d492]/20 flex items-center justify-center shrink-0">
                          <span className="text-[#17d492] text-xs font-black">
                            {dept.charAt(0)}
                          </span>
                        </div>
                        <span className="font-black text-white text-left">
                          {dept}
                        </span>
                        <span className="bg-[#17d492]/15 text-[#17d492] text-xs px-2 py-0.5 rounded-full font-bold">
                          {items.length} {items.length === 1 ? "file" : "files"}
                        </span>
                      </div>
                      <span className="text-slate-400 text-xs font-black">
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="bg-[#16252d] divide-y divide-white/5">
                        {items.map((pyq) => (
                          <div
                            key={pyq._id}
                            className="flex items-center justify-between px-5 py-3.5 hover:bg-[#1a2830]/60 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                                <span className="text-red-400 text-[10px] font-black">
                                  PDF
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-white text-sm font-bold truncate">
                                  {pyq.fileName}
                                </p>
                                <p className="text-slate-500 text-xs mt-0.5">
                                  {pyq.year} · {pyq.branch}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                              <a
                                href={pyq.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-[#17d492]/10 text-[#17d492] border border-[#17d492]/30 px-3 py-1.5 rounded-lg hover:bg-[#17d492]/20 transition font-bold"
                              >
                                View
                              </a>
                              <button
                                onClick={() => deletePYQ(pyq._id)}
                                className="text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}