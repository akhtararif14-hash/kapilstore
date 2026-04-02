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
  "Mini Amazon + Blinkit + Zomato for Students",
  "Open Everyday – 8 AM to 12 AM",
  "Fast Delivery Within 45–90 Minutes",
];

// Search routing map — keyword → destination URL
const SEARCH_ROUTES = [
  // Food
  {
    keywords: [
      "food",
      "biryani",
      "burger",
      "pizza",
      "veg",
      "non veg",
      "nonveg",
      "tiffin",
      "sweets",
      "bakery",
      "ice cream",
      "fast food",
    ],
    href: "/food",
  },
  { keywords: ["veg food", "vegetarian"], href: "/food?sub=veg-food" },
  {
    keywords: ["non veg", "nonveg", "chicken", "mutton", "fish"],
    href: "/food?sub=non-veg-food",
  },
  { keywords: ["tiffin", "dabba"], href: "/food?sub=tiffin" },
  { keywords: ["ice cream", "icecream"], href: "/food?sub=ice-cream" },
  { keywords: ["bakery", "bread", "cake"], href: "/food?sub=bakery" },
  {
    keywords: ["sweets", "dessert", "mithai"],
    href: "/food?sub=sweets-desserts",
  },
  // groceries
  {
    keywords: [
      "groceries",
      "groceries",
      "sabzi",
      "vegetable",
      "fruit",
      "fruits",
      "milk",
      "dairy",
      "snacks",
      "namkeen",
      "chocolate",
      "dry fruit",
      "coconut",
    ],
    href: "/groceries",
  },
  { keywords: ["dairy", "milk", "paneer", "curd"], href: "/groceries/dairy" },
  {
    keywords: ["fruits", "seasonal fruit", "healthy fruit"],
    href: "/groceries/seasonal-fruits",
  },
  {
    keywords: ["vegetables", "sabzi", "green veg"],
    href: "/groceries/green-vegetables",
  },
  { keywords: ["snacks", "namkeen", "chips"], href: "/groceries/snacks-namkeen" },
  { keywords: ["chocolate", "choco"], href: "/groceries/chocolates" },
  {
    keywords: ["dry fruit", "nuts", "almonds", "cashew"],
    href: "/groceries/dry-fruits",
  },
  // Juices
  {
    keywords: [
      "juice",
      "shake",
      "shakes",
      "tea",
      "coffee",
      "cold drink",
      "milkshake",
      "mocktail",
      "drink",
      "beverage",
    ],
    href: "/juices-shakes",
  },
  {
    keywords: ["fresh juice", "fruit juice"],
    href: "/juices-shakes?sub=fresh-juice",
  },
  {
    keywords: ["tea", "coffee", "chai"],
    href: "/juices-shakes?sub=tea-coffee",
  },
  {
    keywords: ["cold drink", "soda", "pepsi", "cola"],
    href: "/juices-shakes?sub=cold-drinks",
  },
  {
    keywords: ["milkshake", "milk shake"],
    href: "/juices-shakes?sub=milkshakes",
  },
  { keywords: ["mocktail"], href: "/juices-shakes?sub=mocktails" },
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
    { label: "Food", href: "/food" },
    { label: "groceries", href: "/groceries" },
    { label: "Stationery", href: "/stationery" },
    { label: "Assignment Help", href: "/others#assignment" },
    { label: "PYQs", href: "/pyqs" },
    { label: "Juices", href: "/juices-shakes" },
    { label: "Leave Application", href: "/others#leave-absence" },
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#17d492]/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" />
              <Image
                src="/heroimage.jpeg"
                alt="Kapil Store"
                width={550}
                height={550}
                className="relative object-contain drop-shadow-2xl animate-bounce-slow"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-[#17d492]/10 border border-[#17d492]/20 text-[#17d492] text-xs font-bold tracking-widest uppercase mb-6">
              Official Hub
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
              The Official Superstore <br />
              <span className="text-[#17d492]">for Students</span>
            </h1>

            <p className="mt-2 text-sm md:text-[18px] font-medium text-slate-300">
              100% Halal Food • groceries • Assignments • PYQs • Stationery •
              Cosmetics • etc.
            </p>
            <p className="mt-1 text-xl md:text-2xl font-medium text-slate-300">
              by Kapil Gupta
            </p>

            {/* Typewriter */}
            <div className="md:mt-4 h-10 flex items-center justify-center md:justify-start">
              <p className="text-md md:text-xl font-mono text-[#17d492] border-r-2 border-[#17d492] pr-1 animate-caret">
                {text}
              </p>
            </div>

            {/* ── UNIVERSAL SEARCH BAR ── */}
            <div className="mt-8 relative" ref={searchRef}>
              <div className="flex items-center gap-2 bg-[#1a2830] border border-[#17d492]/30 rounded-2xl px-4 py-3 focus-within:border-[#17d492] transition-all shadow-lg">
                <FaSearch className="text-[#17d492]/60 shrink-0" size={16} />
                <input
                  type="text"
                  placeholder="Search food, stationery, pyqs, assignment help..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  className="flex-1 bg-transparent text-white placeholder:text-white/25 text-sm focus:outline-none"
                />
                <button
                  onClick={() => handleSearch()}
                  className="bg-[#17d492] text-[#22323c] px-4 py-1.5 rounded-xl font-black text-xs hover:bg-[#14b87e] transition shrink-0 flex items-center gap-1"
                >
                  Search <FaArrowRight size={9} />
                </button>
              </div>

              {/* Dropdown: live suggestions */}
              {showSuggestions && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2830] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {(() => {
                    const route = findRoute(searchQuery);
                    const matchedChips = QUICK_CHIPS.filter((c) =>
                      c.label.toLowerCase().includes(searchQuery.toLowerCase()),
                    );
                    if (matchedChips.length === 0 && !route) {
                      return (
                        <div className="px-4 py-3 text-xs text-slate-500">
                          No exact match — press Enter to search anyway
                        </div>
                      );
                    }
                    return matchedChips.slice(0, 5).map((chip) => (
                      <button
                        key={chip.href}
                        onClick={() => {
                          handleSearch(chip.label);
                          setShowSuggestions(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-[#17d492] hover:bg-[#17d492]/5 transition text-left"
                      >
                        <FaSearch
                          size={11}
                          className="text-[#17d492]/40 shrink-0"
                        />
                        {chip.label}
                      </button>
                    ));
                  })()}
                </div>
              )}
            </div>

            {/* Quick chips */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {QUICK_CHIPS.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="px-3 py-1.5 rounded-full text-xs font-black border border-white/10 text-slate-400 hover:text-[#17d492] hover:border-[#17d492]/30 transition"
                >
                  {chip.label}
                </Link>
              ))}
            </div>

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
