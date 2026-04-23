"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

const STATUS_COLORS = {
  placed: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  preparing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  out_for_delivery: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-[#17d492]/20 text-[#17d492] border-[#17d492]/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};
const STATUS_LABELS = {
  placed: "Order Placed", confirmed: "Confirmed", preparing: "Preparing",
  out_for_delivery: "Out for Delivery", delivered: "Delivered", cancelled: "Cancelled",
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({ phone: "", address: "", isJamiaStudent: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/user/orders");
      
      if (res.status === 401) {
        console.error("Not authorized - session may not be passing");
        setOrders([]);
        return;
      }
      
      if (!res.ok) {
        console.error("Failed to fetch orders:", res.status);
        setOrders([]);
        return;
      }

      const data = await res.json();
      console.log("Orders response:", data); // ← check this in console
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchOrders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#22323c] flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-[#17d492] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#22323c] flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-sm">
          <p className="text-6xl mb-4">👤</p>
          <h2 className="text-2xl font-black text-white mb-3">Sign in to view your profile</h2>
          <p className="text-slate-400 mb-6 font-medium">Track your orders and manage your account</p>
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-6 rounded-xl font-black hover:bg-gray-100 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#22323c] text-[#f5f5f5] py-10 px-4 pt-28">
      <div className="max-w-3xl mx-auto">

        {saved && (
          <div className="mb-6 bg-[#17d492]/10 border border-[#17d492]/30 text-[#17d492] rounded-xl px-4 py-3 font-bold text-sm animate-slide-in">
             Profile updated successfully!
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-[#1a2830] rounded-2xl p-6 mb-8 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {session.user?.image ? (
            <img src={session.user.image} alt="" className="w-16 h-16 rounded-2xl border-2 border-[#17d492]" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[#17d492] flex items-center justify-center text-2xl font-black text-[#22323c]">
              {session.user?.name?.[0] || "U"}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-black text-white">{session.user?.name}</h1>
            <p className="text-slate-500 text-sm">{session.user?.email}</p>
            {session.user?.phone && <p className="text-slate-400 text-sm mt-0.5">📞 {session.user.phone}</p>}
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`text-sm border px-4 py-2 rounded-xl font-bold transition ${
              editMode ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-[#17d492]/30 text-[#17d492] hover:bg-[#17d492]/10"
            }`}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Edit Profile */}
        {editMode && (
          <div className="bg-[#1a2830] rounded-2xl p-6 mb-8 border border-white/5">
            <h2 className="font-black text-[#17d492] mb-4 text-sm uppercase tracking-widest">Edit Profile</h2>
            <div className="space-y-4">
              <input type="tel" placeholder="Phone Number" value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492] transition" />
              <textarea placeholder="Default Delivery Address" rows={3} value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#22323c] border border-white/10 text-white focus:outline-none focus:border-[#17d492] transition" />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={profile.isJamiaStudent}
                  onChange={(e) => setProfile({ ...profile, isJamiaStudent: e.target.checked })}
                  className="w-4 h-4 accent-[#17d492]" />
                <span className="text-sm font-bold text-slate-300">I am a Jamia student (free delivery)</span>
              </label>
              <button onClick={saveProfile} disabled={saving}
                className="bg-[#17d492] text-[#22323c] px-6 py-2.5 rounded-xl font-black hover:bg-[#14b87e] transition disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Orders */}
        <div>
          <h2 className="text-xl font-black mb-6 text-[#17d492]">My Orders</h2>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#17d492] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="text-center py-16 bg-[#1a2830] rounded-2xl border border-white/5">
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-slate-400 font-bold">No orders yet</p>
              <Link href="/" className="mt-3 inline-block text-[#17d492] text-sm font-bold underline">Start Shopping</Link>
            </div>
          )}

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-[#1a2830] rounded-2xl p-5 border border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="font-black text-white">#{order.orderId}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(order.timestamp || order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full border font-bold ${STATUS_COLORS[order.status] || "bg-white/10 text-white border-white/20"}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <span className="font-black text-[#17d492]">₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mb-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span className="text-slate-400">{item.title} × {item.quantity}</span>
                      <span className="text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {["placed", "confirmed", "preparing", "out_for_delivery"].includes(order.status) && (
                  <Link
                    href={`/track/${order.orderId}`}
                    className="inline-flex items-center gap-2 bg-[#17d492]/10 border border-[#17d492]/30 text-[#17d492] text-sm px-4 py-2 rounded-xl font-bold hover:bg-[#17d492]/20 transition"
                  >
                    🗺️ Track Order Live
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
