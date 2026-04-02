"use client";
import React, { useState } from "react";

const ContactClient = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setPopup({
        show: true,
        message: "Message sent successfully!",
        type: "success",
      });

      setForm({ name: "", email: "", message: "" });
    } catch {
      setPopup({
        show: true,
        message: "Failed to send message. Try again!",
        type: "error",
      });
    }

    setTimeout(() => {
      setPopup((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <section className="bg-[#22323c] text-[#f5f5f5] min-h-screen relative py-15">
      {/* POPUP */}
      {popup.show && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg text-sm font-semibold
              ${
                popup.type === "success"
                  ? "bg-[#17d492] text-[#22323c]"
                  : "bg-red-500 text-white"
              }`}
          >
            {popup.message}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#17d492] mb-8">Contact Us</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#22323c] border border-[#17d492]/30 rounded-lg p-8 space-y-6"
        >
          <input
            type="text"
            placeholder="Your Name"
            required
            className="w-full p-3 rounded bg-transparent border border-[#f5f5f5]/30 focus:outline-none focus:border-[#17d492]"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Your Email"
            required
            className="w-full p-3 rounded bg-transparent border border-[#f5f5f5]/30 focus:outline-none focus:border-[#17d492]"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <textarea
            placeholder="Your Message"
            rows="5"
            required
            className="w-full p-3 rounded bg-transparent border border-[#f5f5f5]/30 focus:outline-none focus:border-[#17d492]"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <button
            type="submit"
            className="bg-[#17d492] text-[#22323c] px-6 py-3 rounded font-semibold hover:scale-105 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactClient;
