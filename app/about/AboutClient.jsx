"use client";
import React from "react";

const AboutClient = () => {
  return (
    <section className="bg-[#22323c] text-[#f5f5f5] min-h-screen py-15">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#17d492] mb-6">About Us</h1>

        <p className="text-lg text-[#f5f5f5]/80 leading-relaxed mb-6">
          We are a local stationery platform built specially for students,
          especially Jamia students. Our mission is to make stationery items
          affordable, accessible, and delivered quickly.
        </p>

        <p className="text-lg text-[#f5f5f5]/80 leading-relaxed mb-6">
          From notebooks and pens to art supplies and exam essentials, we
          provide everything at the lowest possible price with
          <span className="text-[#17d492] font-semibold">Cash on Delivery</span>
          convenience.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="p-6 border border-[#17d492]/30 rounded-lg">
            <h3 className="text-xl font-semibold text-[#17d492]">
              Lowest Prices
            </h3>
            <p className="text-sm mt-2 text-[#f5f5f5]/80">
              Student-friendly pricing on all stationery items.
            </p>
          </div>

          <div className="p-6 border border-[#17d492]/30 rounded-lg">
            <h3 className="text-xl font-semibold text-[#17d492]">
              Free Delivery
            </h3>
            <p className="text-sm mt-2 text-[#f5f5f5]/80">
              Free delivery for Jamia students.
            </p>
          </div>

          <div className="p-6 border border-[#17d492]/30 rounded-lg">
            <h3 className="text-xl font-semibold text-[#17d492]">
              COD Available
            </h3>
            <p className="text-sm mt-2 text-[#f5f5f5]/80">
              Pay only when you receive your order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutClient;
