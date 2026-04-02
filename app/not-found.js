"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen bg-[#22323c] text-[#f5f5f5] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 */}
        <h1 className="text-7xl font-extrabold text-[#17d492]">404</h1>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>

        <p className="mt-3 text-[#f5f5f5]/80">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* CTA */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="bg-[#17d492] text-[#22323c] px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Go Home
          </Link>

          <Link
            href="/contact"
            className="border border-[#17d492] text-[#17d492] px-6 py-3 rounded-lg hover:bg-[#17d492] hover:text-[#22323c] transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
