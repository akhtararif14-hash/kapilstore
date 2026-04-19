"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaShoppingBasket,
  FaPencilAlt,
  FaFileAlt,
  FaChalkboardTeacher,
  FaHome,
  FaEllipsisH,
  FaBook,
  FaCalculator,
  FaFolder,
  FaPen,
  FaGraduationCap,
  FaTshirt,
  FaLaptop,
  FaPrint,
  FaIdCard,
  FaWhatsapp,
  FaSearch,
} from "react-icons/fa";
import { MdDraw, MdMenuBook } from "react-icons/md";
import { MdEventBusy } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";

const TOP_NAV = [
  { id: "stationery", label: "Stationery", href: "/stationery" },
  { id: "assignment", label: "Assignment Paid Service", href: "/others#assignment" },
  { id: "xerox", label: "Xerox & Printout", href: "/others#printout-scan" },
  { id: "tuition", label: "Tution Services", href: "/others#tuition" },
  { id: "others", label: "Others", Icon: FaEllipsisH, href: "/others" },
];

const STATIONERY_SUBS = [
  { label: "Books & Notebooks", href: "/stationery/", Icon: FaBook },
  { label: "Calculators", href: "/stationery", Icon: FaCalculator },
  { label: "Drawing Materials", href: "/stationery/", Icon: MdDraw },
  { label: "Pens (All Types)", href: "/stationery/", Icon: FaPen },
  { label: "Files & Folders", href: "/stationery/", Icon: FaFolder },
  { label: "BTech & Polytechnic", href: "/stationery/", Icon: FaGraduationCap },
  { label: "Jamia School Material", href: "/stationery/", Icon: MdMenuBook },
  { label: "Other Stationery", href: "/stationery/", Icon: FaEllipsisH },
];

const OTHERS_SECTIONS = [
  {
    title: "Assignment Services",
    TitleIcon: FaFileAlt,
    links: [
      { label: "IGNOU Assignment Work", href: "/others#ignou-assignment", Icon: FaBook },
      { label: "Handwritten Assignments", href: "/others#handwritten", Icon: FaPen },
      { label: "Typed Assignments", href: "/others#typed", Icon: FaFileAlt },
      { label: "Project Work", href: "/others#project-work", Icon: FaFolder },
      { label: "PPT Making", href: "/others#ppt", Icon: FaLaptop },
      { label: "Engineering Drawing", href: "/others#engineering-drawing", Icon: MdDraw },
      { label: "Thesis Help", href: "/others#thesis", Icon: FaBook },
    ],
  },
  {
    title: "Tuition Services",
    TitleIcon: FaChalkboardTeacher,
    links: [
      { label: "School Tuition", href: "/others#school-tuition", Icon: FaGraduationCap },
      { label: "College Tuition", href: "/others#college-tuition", Icon: FaGraduationCap },
      { label: "Home Tuition", href: "/others#home-tuition", Icon: FaHome },
      { label: "Entrance Exam Prep", href: "/others#entrance-exam", Icon: FaBook },
      { label: "IGNOU Help", href: "/others#ignou-help", Icon: FaFileAlt },
    ],
  },
  {
    title: "Only For Students",
    TitleIcon: FaUser,
    links: [
      { label: "Clothes Ironing", href: "/others#ironing", Icon: FaTshirt },
      { label: "Laundry Service", href: "/others#laundry", Icon: FaTshirt },
      { label: "Resume / CV Making", href: "/others#resume", Icon: FaIdCard },
      { label: "Leave & Absence Help", href: "/others#leave-absence", Icon: MdEventBusy },
      { label: "Laptop / Mobile Repair", href: "/others#laptop-repair", Icon: FaLaptop },
      { label: "Printout / Scan", href: "/others#printout-scan", Icon: FaPrint },
      { label: "Shoes & Bags", href: "/others#shoes-bags", Icon: FaShoppingBasket },
      { label: "PYQs", href: "/pyqs", Icon: MdMenuBook },
    ],
  },
];

const SEARCH_ROUTES = [
  { keywords: ["stationery", "notebook", "pen", "pencil", "calculator", "drawing", "file", "folder", "xerox", "printout", "print"], href: "/stationery" },
  { keywords: ["notebook", "books", "copy"], href: "/stationery" },
  { keywords: ["pen", "pens", "ball pen", "gel pen"], href: "/stationery" },
  { keywords: ["calculator"], href: "/stationery" },
  { keywords: ["drawing material", "compass", "scale", "geometry"], href: "/stationery" },
  { keywords: ["btech", "polytechnic", "engineering material"], href: "/stationery" },
  { keywords: ["xerox", "printout", "scan", "photocopy"], href: "/stationery" },
  { keywords: ["assignment", "ignou", "handwritten", "typed", "project", "ppt", "presentation", "thesis", "drawing work"], href: "/others#assignment" },
  { keywords: ["tuition", "tutor", "coaching", "home tuition", "entrance exam", "exam form"], href: "/others#tuition" },
  { keywords: ["rent", "pg", "room", "hostel", "electronics rent", "calculator rent"], href: "/others#earn-rent" },
  { keywords: ["pyq", "previous year", "question paper", "past paper", "exam paper"], href: "/pyqs" },
  { keywords: ["laundry", "washing", "clothes wash"], href: "/others#student-services" },
  { keywords: ["ironing", "iron"], href: "/others#student-services" },
  { keywords: ["resume", "cv", "curriculum vitae"], href: "/others#student-services" },
  { keywords: ["laptop repair", "mobile repair", "phone repair"], href: "/others#student-services" },
  { keywords: ["shoes", "footwear", "slippers", "bags", "bag"], href: "/others#shoes-bags" },
  { keywords: ["leave", "absence", "application", "letter", "leave application"], href: "/others#leave-absence" },
  { keywords: ["others", "services", "all services"], href: "/others" },
  { keywords: ["contact", "call", "whatsapp"], href: "/contact" },
];

function findRoute(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  let bestMatch = null;
  let bestScore = 0;
  for (const route of SEARCH_ROUTES) {
    for (const keyword of route.keywords) {
      if (q.includes(keyword) || keyword.includes(q)) {
        const score = keyword.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = route.href;
        }
      }
    }
  }
  return bestMatch;
}

const QUICK_CHIPS = [
  { label: "Stationery", href: "/stationery" },
  { label: "Xerox & Printout", href: "/others#printout-scan" },
  { label: "Assignment Help", href: "/others#assignment" },
  { label: "PYQs", href: "/pyqs" },
  { label: "Tuition", href: "/others#tuition" },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const { data: session } = useSession();
  const { cart } = useCart();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleDropdown = (id) =>
    setActiveDropdown((prev) => (prev === id ? null : id));

  const handleSearch = (q = searchQuery) => {
    const query = q.trim();
    if (!query) return;
    const route = findRoute(query);
    setShowSuggestions(false);
    setSearchQuery("");
    router.push(route || `/stationery?search=${encodeURIComponent(query)}`);
  };

  const handleMobileSearch = (q = mobileSearchQuery) => {
    const query = q.trim();
    if (!query) return;
    const route = findRoute(query);
    setMobileSearchOpen(false);
    setMobileSearchQuery("");
    router.push(route || `/stationery?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#22323c]/90 backdrop-blur-xl shadow-xl py-2"
            : "bg-[#22323c] py-3"
        }`}
        ref={dropdownRef}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/logonav.png"
                alt="Kapil Store"
                width={100}
                height={40}
                className="h-11 w-auto"
              />
            </Link>

            {/* Desktop Nav + Search */}
            <div
              className="hidden lg:flex items-center gap-1 flex-1 justify-center"
              ref={searchRef}
            >
              {TOP_NAV.map((item) => {
                const hasDropdown =
                  item.id === "stationery" || item.id === "others";
                const isActive = activeDropdown === item.id;

                if (hasDropdown) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleDropdown(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        isActive
                          ? "bg-[#17d492]/15 text-[#17d492]"
                          : "text-slate-300 hover:text-[#17d492] hover:bg-white/5"
                      }`}
                    >
                      <span>{item.label}</span>
                      <FaChevronDown
                        size={9}
                        className={`transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                      />
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-300 hover:text-[#17d492] hover:bg-white/5 transition-all"
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Desktop Search Bar — after Others */}
              <div className="relative ml-2">
                <div className="flex items-center bg-white/8 border border-white/10 rounded-xl px-3 py-2 gap-2 w-52 focus-within:border-[#17d492]/50 focus-within:bg-white/10 transition-all">
                  <FaSearch size={12} className="text-slate-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                    className="bg-transparent text-xs text-white placeholder-slate-500 outline-none w-full"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setShowSuggestions(false);
                      }}
                      className="text-slate-500 hover:text-white transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  )}
                </div>

                {/* Desktop suggestions dropdown */}
                {showSuggestions && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2830] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden min-w-[220px]">
                    {(() => {
                      const matchedChips = QUICK_CHIPS.filter((c) =>
                        c.label.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      if (matchedChips.length === 0) {
                        return (
                          <div className="px-4 py-3 text-xs text-slate-500">
                            Press Enter to search
                          </div>
                        );
                      }
                      return matchedChips.slice(0, 5).map((chip) => (
                        <button
                          key={chip.href}
                          onClick={() => handleSearch(chip.label)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-[#17d492] hover:bg-[#17d492]/5 transition text-left"
                        >
                          <FaSearch size={10} className="text-[#17d492]/40 shrink-0" />
                          {chip.label}
                        </button>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/cart"
                className="relative p-2 text-white hover:text-[#17d492] transition"
              >
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#17d492] text-[#22323c] text-xs font-black flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile search icon */}
              <button
                className="lg:hidden p-2 text-white hover:text-[#17d492] transition rounded-full border border-white/15 hover:border-[#17d492]/40"
                onClick={() => {
                  setMobileSearchOpen((prev) => !prev);
                  setMobileOpen(false);
                }}
              >
                <FaSearch size={15} />
              </button>

              {session ? (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 text-slate-300 hover:text-[#17d492] transition"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-[#17d492]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#17d492]/20 border-2 border-[#17d492] flex items-center justify-center">
                        <FaUser size={12} className="text-[#17d492]" />
                      </div>
                    )}
                    <FaChevronDown
                      size={10}
                      className={`transition-transform ${userMenu ? "rotate-180" : ""}`}
                    />
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a2830] border border-[#17d492]/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm font-black text-white truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenu(false)}
                        className="block px-4 py-3 text-sm text-slate-300 hover:text-[#17d492] hover:bg-[#17d492]/5 transition"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="hidden lg:flex items-center gap-2 bg-[#17d492] text-[#22323c] px-4 py-2 rounded-xl font-black text-sm hover:bg-[#14b87e] transition"
                >
                  Sign In
                </button>
              )}

              <button
                className="lg:hidden text-white hover:text-[#17d492] transition p-1"
                onClick={() => {
                  setMobileOpen(!mobileOpen);
                  setMobileSearchOpen(false);
                }}
              >
                {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Dropdown: Stationery */}
        {activeDropdown === "stationery" && (
          <div className="hidden lg:block absolute top-full left-0 right-0 bg-[#1a2830] border-t border-[#17d492]/10 shadow-2xl z-40">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center gap-3 mb-4">
                <FaPencilAlt className="text-[#17d492]" size={18} />
                <h3 className="text-lg font-black text-[#17d492]">Stationery</h3>
                <Link
                  href="/stationery"
                  onClick={() => setActiveDropdown(null)}
                  className="ml-auto text-xs font-black text-[#17d492] border border-[#17d492]/30 px-3 py-1.5 rounded-lg hover:bg-[#17d492]/10 transition"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {STATIONERY_SUBS.map((sub) => {
                  const { Icon } = sub;
                  return (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-[#17d492] hover:bg-[#17d492]/8 border border-transparent hover:border-[#17d492]/20 transition-all"
                    >
                      <Icon size={14} className="text-blue-400 shrink-0" />
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Dropdown: Others mega menu */}
        {activeDropdown === "others" && (
          <div className="hidden lg:block absolute top-full left-0 right-0 bg-[#1a2830] border-t border-[#17d492]/10 shadow-2xl z-40">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center gap-3 mb-5">
                <FaEllipsisH className="text-[#17d492]" size={18} />
                <h3 className="text-lg font-black text-[#17d492]">
                  All Services & Others
                </h3>
                <Link
                  href="/others"
                  onClick={() => setActiveDropdown(null)}
                  className="ml-auto text-xs font-black text-[#17d492] border border-[#17d492]/30 px-3 py-1.5 rounded-lg hover:bg-[#17d492]/10 transition"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {OTHERS_SECTIONS.map((section) => {
                  const { TitleIcon } = section;
                  return (
                    <div key={section.title}>
                      <div className="flex items-center gap-2 mb-3">
                        <TitleIcon size={12} className="text-[#17d492]" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          {section.title}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {section.links.map((link) => {
                          const { Icon } = link;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-[#17d492] hover:bg-[#17d492]/8 transition"
                            >
                              <Icon size={11} className="text-[#17d492]/50 shrink-0" />
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[60px] bottom-0 bg-[#1a2830] overflow-y-auto transition-all duration-300 z-40 ${
            mobileOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-4 space-y-1">
            {TOP_NAV.map((item) => {
              const hasDropdown =
                item.id === "stationery" || item.id === "others";
              const isExpanded = mobileExpanded === item.id;
              const subItems =
                item.id === "stationery"
                  ? STATIONERY_SUBS
                  : item.id === "others"
                  ? OTHERS_SECTIONS.flatMap((s) => s.links)
                  : [];

              return (
                <div key={item.id}>
                  {hasDropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileExpanded(isExpanded ? null : item.id)
                        }
                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-white font-black hover:text-[#17d492] hover:bg-white/5 transition"
                      >
                        <span className="text-sm uppercase tracking-wider">
                          {item.label}
                        </span>
                        <FaChevronDown
                          size={11}
                          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="ml-9 mt-1 space-y-1 pb-2">
                          {subItems.map((sub) => {
                            const SubIcon = sub.Icon;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-[#17d492] hover:bg-[#17d492]/5 transition"
                              >
                                <SubIcon
                                  size={12}
                                  className="text-[#17d492]/50 shrink-0"
                                />
                                {sub.label}
                              </Link>
                            );
                          })}
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2 text-xs text-[#17d492] font-black"
                          >
                            View All {item.label} →
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white font-black hover:text-[#17d492] hover:bg-white/5 transition"
                    >
                      <span className="text-sm uppercase tracking-wider">
                        {item.label}
                      </span>
                    </Link>
                  )}
                </div>
              );
            })}

            {/* Mobile auth + support */}
            <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
              <Link
                href="/pyqs"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white font-black hover:text-[#17d492] hover:bg-white/5 transition text-sm uppercase tracking-wider"
              >
                <MdMenuBook size={16} className="text-[#17d492]" /> PYQs
              </Link>

              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-[#17d492] hover:bg-white/5 transition text-sm"
                  >
                    <FaUser size={14} className="text-[#17d492]" /> My Orders
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-bold"
                  >
                    <FaTimes size={14} /> Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="w-full bg-[#17d492] text-[#22323c] py-3.5 rounded-xl font-black hover:bg-[#14b87e] transition text-sm"
                >
                  Sign in with Google
                </button>
              )}

          {/* Support section */}
          <div className="px-4 pt-3">
            <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">
              Support
            </p>
            <a
              href="https://wa.me/917982670413"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#17d492] font-black mt-1 text-sm"
            >
              <FaWhatsapp size={14} /> +91 7982670413
            </a>
          </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar — slides in below navbar */}
      <div
        className={`lg:hidden fixed inset-x-0 z-40 transition-all duration-300 ${
          mobileSearchOpen
            ? "top-[60px] opacity-100 pointer-events-auto"
            : "top-[48px] opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-[#1a2830] border-b border-[#17d492]/15 shadow-xl px-4 py-3">
          <div className="flex items-center gap-2 bg-[#22323c] border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#17d492]/50 transition-all">
            <FaSearch size={13} className="text-[#17d492]/60 shrink-0" />
            <input
              type="text"
              placeholder="Search stationery, assignments, pyqs..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleMobileSearch()}
              autoFocus={mobileSearchOpen}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            />
            {mobileSearchQuery ? (
              <button
                onClick={() => setMobileSearchQuery("")}
                className="text-slate-500 hover:text-white transition p-1"
              >
                <FaTimes size={11} />
              </button>
            ) : (
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="text-slate-500 hover:text-white transition p-1"
              >
                <FaTimes size={11} />
              </button>
            )}
            <button
              onClick={() => handleMobileSearch()}
              className="bg-[#17d492] text-[#22323c] px-3 py-1.5 rounded-lg font-black text-xs hover:bg-[#14b87e] transition shrink-0"
            >
              Go
            </button>
          </div>

          {/* Quick chips inside mobile search */}
          <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.href}
                onClick={() => handleMobileSearch(chip.label)}
                className="shrink-0 px-3 py-1 rounded-full text-xs font-black border border-white/10 text-slate-400 hover:text-[#17d492] hover:border-[#17d492]/30 transition whitespace-nowrap"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}