"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaArrowRight,
} from "react-icons/fa";

const words = [
  "Open 24/7 for Stationery & Assignments",
  "Lowest printout prices in Jamia just ₹4/colour page",
  "All stationary items at lowest prices",
  "Free delivery for Jamia students",
];

// Search routing map — keyword → destination URL
const SEARCH_ROUTES = [
 // Stationery
  {
    keywords: [
      "stationery",
      "notebook",
      "pen",
      "pencil",
      "calculator",
      "drawing",
      "file",
      "folder",
      "xerox",
      "printout",
      "print",
    ],
    href: "/stationery",
  },
  {
    keywords: ["notebook", "books", "copy"],
    href: "/stationery",
  },
  {
    keywords: ["pen", "pens", "ball pen", "gel pen"],
    href: "/stationery",
  },
  { keywords: ["calculator"], href: "/stationery" },
  {
    keywords: ["drawing material", "compass", "scale", "geometry"],
    href: "/stationery",
  },
  {
    keywords: ["btech", "polytechnic", "engineering material"],
    href: "/stationery",
  },
  {
    keywords: ["xerox", "printout", "scan", "photocopy"],
    href: "/stationery",
  },
  // Assignment
  {
    keywords: [
      "assignment",
      "ignou",
      "handwritten",
      "typed",
      "project",
      "ppt",
      "presentation",
      "thesis",
      "drawing work",
    ],
    href: "/others#assignment",
  },
  // Tuition
  {
    keywords: [
      "tuition",
      "tutor",
      "coaching",
      "home tuition",
      "entrance exam",
      "exam form",
    ],
    href: "/others#tuition",
  },
  // Earn & Rent
  {
    keywords: [
      "rent",
      "pg",
      "room",
      "hostel",
      "electronics rent",
      "calculator rent",
    ],
    href: "/others#earn-rent",
  },
  // PYQs
  {
    keywords: [
      "pyq",
      "previous year",
      "question paper",
      "past paper",
      "exam paper",
    ],
    href: "/pyqs",
  },
  // Others/services
  {
    keywords: ["laundry", "washing", "clothes wash"],
    href: "/others#student-services",
  },
  { keywords: ["ironing", "iron"], href: "/others#student-services" },
  {
    keywords: ["resume", "cv", "curriculum vitae"],
    href: "/others#student-services",
  },
  {
    keywords: ["laptop repair", "mobile repair", "phone repair"],
    href: "/others#student-services",
  },
  {
    keywords: ["shoes", "footwear", "slippers", "bags", "bag"],
    href: "/others#shoes-bags",
  },
  {
    keywords: [
      "medicine",
      "medical",
      "pharmacy",
      "chemist",
      "skincare",
      "cosmetics",
      "makeup",
    ],
    href: "/others#chemist",
  },
  { keywords: ["utensil", "kitchen", "cooking"], href: "/others#utensils" },
  {
    keywords: [
      "leave",
      "absence",
      "application",
      "letter",
      "leave application",
    ],
    href: "/others#leave-absence",
  },
  { keywords: ["clothes", "wear", "shirt", "jeans"], href: "/others#clothes" },
  // General
  { keywords: ["others", "services", "all services"], href: "/others" },
  { keywords: ["contact", "call", "whatsapp"], href: "/contact" },
  { keywords: ["about", "kapil", "founder"], href: "/#aboutme" },
];

function findRoute(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  // Find best match by checking if any keyword is contained in query or vice versa
  let bestMatch = null;
  let bestScore = 0;

  for (const route of SEARCH_ROUTES) {
    for (const keyword of route.keywords) {
      if (q.includes(keyword) || keyword.includes(q)) {
        const score = keyword.length; // longer keyword = more specific match
        if (score > bestScore) {
          bestScore = score;
          bestMatch = route.href;
        }
      }
    }
  }

  return bestMatch;
}

const Hero = () => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Typewriter
  useEffect(() => {
    const currentWord = words[wordIndex];
    if (charIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + currentWord[charIndex]);
        setCharIndex(charIndex + 1);
      }, 60);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 2000);
      return () => clearTimeout(pause);
    }
  }, [charIndex, wordIndex]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
   // Quick suggestion chips
  const QUICK_CHIPS = [
    { label: "Stationery", href: "/stationery" },
    { label: "Xerox & Printout", href: "/stationery#xerox-printout" },
    { label: "Assignment Help", href: "/others#assignment" },
    { label: "PYQs", href: "/pyqs" },
    { label: "Tuition", href: "/others#tuition" },
  ];

  const handleSearch = (q = searchQuery) => {
    const query = q.trim();
    if (!query) return;
    const route = findRoute(query);
    setShowSuggestions(false);
    if (route) {
      router.push(route);
    } else {
      // Fallback: go to stationery with search
      router.push(`/stationery?search=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative overflow-hidden bg-[#22323c] text-[#f5f5f5] min-h-[85vh] flex items-center">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#17d492]/10 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6  w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">
          {/* Image */}
          

          {/* Content */}
          <div className="w-full md:w-1/2  md:text-left">

           
            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link href="#products" className="w-full sm:w-auto">
                <button className="w-full bg-[#17d492] text-[#22323c] px-8 py-4 rounded-xl font-bold hover:bg-[#14b87e] hover:-translate-y-1 transition-all shadow-[0_10px_20px_-10px_rgba(23,212,146,0.4)]">
                  Shop Products
                </button>
              </Link>
              <Link href="/#aboutme" className="w-full sm:w-auto">
                <button className="w-full border-2 border-slate-700 text-slate-300 px-8 py-4 rounded-xl font-bold hover:bg-slate-800 hover:text-white transition-all">
                  Contact Kapil
                </button>
              </Link>
            </div>

            {/* Social links */}
            {/* <div className="mt-6 flex items-center gap-4 justify-center md:justify-start">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Follow us
              </p>
              <a
                href="https://www.instagram.com/kapilstore.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-pink-400 transition"
              >
                <FaInstagram size={16} className="text-pink-400" />
                Instagram
              </a>
              <a
                href="https://t.me/kapilstore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-blue-400 transition"
              >
                <FaTelegram size={16} className="text-blue-400" />
                Telegram
              </a>
              <a
                href="https://wa.me/917982670413"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-[#17d492] transition"
              >
                <FaWhatsapp size={16} className="text-[#17d492]" />
                WhatsApp
              </a>
            </div> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        @keyframes caret {
          50% {
            border-color: transparent;
          }
        }
        .animate-caret {
          animation: caret 0.8s step-end infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
