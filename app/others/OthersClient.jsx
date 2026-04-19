"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FaFileAlt,
  FaHome,
  FaChalkboardTeacher,
  FaWhatsapp,
  FaArrowRight,
  FaTshirt,
  FaLaptop,
  FaPrint,
  FaIdCard,
  FaMoneyBillWave,
  FaCalculator,
  FaRunning,
  FaBriefcase,
  FaBook,
  FaMale,
  FaFemale,
  FaShoePrints,
  FaFileSignature,
  FaUserClock,
  FaClipboardList,
  FaHospital,
  FaInstagram,
  FaTelegram,
} from "react-icons/fa";
import {
  MdMenuBook,
  MdLocalLaundryService,
  MdIron,
  MdDry,
  MdElectricBolt,
  MdMoveToInbox,
  MdMedicalServices,
  MdSpa,
  MdSoap,
  MdEventBusy,
} from "react-icons/md";
import { GiKitchenKnives, GiCookingPot, GiMedicalPack } from "react-icons/gi";
import { BsPersonBadge, BsBagFill } from "react-icons/bs";

const SECTION_ICONS = {
  assignment: FaFileAlt,
  "earn-rent": FaHome,
  tuition: FaChalkboardTeacher,
  "student-services": MdElectricBolt,
  "shoes-bags": BsBagFill,
  "xerox-printout": FaPrint,
  pyq: MdMenuBook,
  utensils: GiKitchenKnives,
  clothes: FaTshirt,
  // chemist: MdMedicalServices,
  "leave-absence": MdEventBusy,
};

const ITEM_ICONS = {
  // Assignment
  "IGNOU Assignment Work": FaBook,
  "Handwritten Assignments": FaFileAlt,
  "Typed Assignments": FaFileAlt,
  "Project Work": FaBriefcase,
  "Presentation (PPT) Making": FaLaptop,
  "Engineering Drawing": FaFileAlt,
  "Polytechnic Drawing": FaFileAlt,
  "Thesis Help": FaBook,
  "School Assignment": FaBook,
  "College Assignment": FaBook,
  "Drawing Work": FaFileAlt,
  "Important Questions Solving": FaBook,
  // Earn & Rent
  "Calculators on Rent": FaCalculator,
  "PG / Rooms on Rent": FaHome,
  "Electronics on Rent": FaLaptop,
  "Room Essentials on Rent": FaHome,
  "Travel & Transport on Rent": FaRunning,
  "Daily Use Items on Rent": FaBriefcase,
  "Money on Rent": FaMoneyBillWave,
  // Tuition
  "School Tuition Available": FaChalkboardTeacher,
  "College Tuition Available": FaChalkboardTeacher,
  "Home Tuition Available": FaHome,
  "Entrance Exam Preparation": FaBook,
  "Tutor Available": FaChalkboardTeacher,
  "IGNOU Help": FaBook,
  "Exam Form Filling": FaFileAlt,
  "Online Form Filling Service": FaFileAlt,
  // Student services
  "Clothes Ironing": MdIron,
  "Laundry Service": MdLocalLaundryService,
  "Dry Cleaning": MdDry,
  "Resume / CV Making": BsPersonBadge,
  "Mobile Recharge & Bill Payment": FaMoneyBillWave,
  "Laptop / Mobile Repair": FaLaptop,
  "Packing & Shifting Help": MdMoveToInbox,
  "Printout / Scan Service": FaPrint,
  "ID Card / Document Help": FaIdCard,
  // Shoes & Bags
  "Men's Footwear": FaShoePrints,
  "Women's Footwear": FaShoePrints,
  "Sports Shoes": FaRunning,
  "Formal Shoes": FaShoePrints,
  Slippers: FaShoePrints,
  "School & College Bags": BsBagFill,
  "Ladies Bags": BsBagFill,
  // PYQ
  "Previous Year Question Papers": MdMenuBook,
  "Department-wise PYQs": MdMenuBook,
  "Download Free PDFs": FaFileAlt,
  "All Branches Available": FaBook,
  // Utensils
  "Kitchen Utensils": GiKitchenKnives,
  "Cooking Equipment": GiCookingPot,
  "Plates & Bowls": GiCookingPot,
  "Utensils on Rent": GiKitchenKnives,
  "Hostel Essentials": FaHome,
  // Clothes
  "Men's Wear": FaMale,
  "Women's Wear": FaFemale,
  // Chemist
  // Medicines: MdMedicalServices,
  // "OTC Medicines": GiMedicalPack,
  // Skincare: MdSpa,
  // Haircare: MdSpa,
  // "Bath & Body": MdSoap,
  // "Oral Care": MdSoap,
  // "Men Grooming": FaMale,
  // "Women Hygiene": FaFemale,
  // "Makeup & Beauty": MdSpa,
  // "Perfumes & Deodorants": MdSpa,
  // Leave & Absence
  "Leave Application Writing": FaFileSignature,
  "Medical Leave Letter": FaHospital,
  "Casual Leave Application": FaUserClock,
  "Duty Leave Application": FaClipboardList,
  "Absence Explanation Letter": FaFileAlt,
  "Late Coming Application": FaUserClock,
  "Early Leave Request": MdEventBusy,
  "College Gate Pass Help": FaIdCard,
  "Hostel Leave Application": FaHome,
  "Internship / Training Letter": FaBriefcase,
  "NOC Letter Help": FaFileAlt,
  "Character Certificate Help": FaFileSignature,
};

const SECTIONS = [
  {
    id: "assignment",
    title: "Paid Assignment Services",
    color: "#8b5cf6",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    contact: true,
    items: [
      "IGNOU Assignment Work",
      "Handwritten Assignments",
      "Typed Assignments",
      "Project Work",
      "Presentation (PPT) Making",
      "Engineering Drawing",
      "Polytechnic Drawing",
      "Thesis Help",
      "School Assignment",
      "College Assignment",
      "Drawing Work",
      "Important Questions Solving",
    ],
  },
  // {
  //   id: "earn-rent",
  //   title: "Student Earn & Rent Hub",
  //   color: "#ec4899",
  //   bgColor: "bg-pink-500/10",
  //   borderColor: "border-pink-500/20",
  //   contact: true,
  //   items: [
  //     "Calculators on Rent",
  //     "PG / Rooms on Rent",
  //     "Electronics on Rent",
  //     "Room Essentials on Rent",
  //     "Travel & Transport on Rent",
  //     "Daily Use Items on Rent",
  //     "Money on Rent",
  //   ],
  // },
  {
    id: "Xerox & Printout",
    title: "Xerox & Printout",
    color: "#06d410",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    contact: true,
    items: [
      "Document Copying",
      "Printing Services",
      "Binding Services",
      "Scan to Email Service",
      "Thesis / Project Printing",
      "ID Card Printing",
      "Resume / CV Printing",
      "Assignment Printing",
      "Photocopying Services",

    ],
  },
  {
    id: "tuition",
    title: "Tuition Services",
    color: "#06b6d4",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    contact: true,
    items: [
      "School Tuition Available",
      "College Tuition Available",
      "Home Tuition Available",
      "Entrance Exam Preparation",
      "Tutor Available",
      "IGNOU Help",
      "Exam Form Filling",
      "Online Form Filling Service",
    ],
  },
  {
    id: "student-services",
    title: "Only For Students",
    color: "#17d492",
    bgColor: "bg-[#17d492]/10",
    borderColor: "border-[#17d492]/20",
    contact: true,
    items: [
      "Clothes Ironing",
      "Laundry Service",
      "Dry Cleaning",
      "Resume / CV Making",
      "Mobile Recharge & Bill Payment",
      "Laptop / Mobile Repair",
      "Packing & Shifting Help",
      "Printout / Scan Service",
      "ID Card / Document Help",
    ],
  },
  {
    id: "leave-absence",
    title: "Leave & Absence Solution",
    color: "#f59e0b",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    contact: false,
    badge: "New",
    instagramLink: "https://instagram.com/myraanshika",
    telegramLink: "https://t.me/Myraanshika",
    items: [],
  },
  {
    id: "shoes-bags",
    title: "Shoes & Bags",
    color: "#f59e0b",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    contact: true,
    items: [
      "Men's Footwear",
      "Women's Footwear",
      "Sports Shoes",
      "Formal Shoes",
      "Slippers",
      "School & College Bags",
      "Ladies Bags",
    ],
  },
  {
    id: "pyq",
    title: "PYQ Section",
    color: "#17d492",
    bgColor: "bg-[#17d492]/10",
    borderColor: "border-[#17d492]/20",
    contact: false,
    isLink: true,
    linkHref: "/pyqs",
    linkLabel: "Browse PYQs",
    items: [
      "Previous Year Question Papers",
      "Department-wise PYQs",
      "Download Free PDFs",
      "All Branches Available",
    ],
  },
  {
    id: "utensils",
    title: "Utensils Services",
    color: "#f97316",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    contact: true,
    items: [
      "Kitchen Utensils",
      "Cooking Equipment",
      "Plates & Bowls",
      "Utensils on Rent",
      "Hostel Essentials",
    ],
  },
  {
    id: "clothes",
    title: "Clothes Section",
    color: "#a855f7",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    contact: true,
    items: ["Men's Wear", "Women's Wear"],
  },
  // {
  //   id: "chemist",
  //   title: "Chemist & Cosmetics",
  //   color: "#ef4444",
  //   bgColor: "bg-red-500/10",
  //   borderColor: "border-red-500/20",
  //   contact: true,
  //   items: [
  //     "Medicines",
  //     "OTC Medicines",
  //     "Skincare",
  //     "Haircare",
  //     "Bath & Body",
  //     "Oral Care",
  //     "Men Grooming",
  //     "Women Hygiene",
  //     "Makeup & Beauty",
  //     "Perfumes & Deodorants",
  //   ],
  // },
];

export default function OthersClient() {
  const searchParams = useSearchParams();
  const hash = searchParams.get("section");
  const sectionRefs = useRef({});

  useEffect(() => {
    if (hash && sectionRefs.current[hash]) {
      setTimeout(() => {
        sectionRefs.current[hash].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-[#22323c] text-[#f5f5f5]">
      {/* Hero */}
      <div className="bg-[#1a2830] border-b border-white/5 pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#17d492]/10 border border-[#17d492]/20 rounded-full px-4 py-1.5 mb-5">
            <MdElectricBolt size={13} className="text-[#17d492]" />
            <span className="text-[#17d492] text-xs font-black uppercase tracking-widest">
              All Services
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Everything <span className="text-[#17d492]">Students Need</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto text-base">
            From assignments to rentals, tuition to laundry — we've got every
            student service in one place.
          </p>

          {/* Quick jump links */}
          <div className="flex flex-wrap justify-center gap-2 mt-7">
            {SECTIONS.map((s) => {
              const Icon = SECTION_ICONS[s.id] || FaFileAlt;
              return (
                <button
                  key={s.id}
                  onClick={() =>
                    sectionRefs.current[s.id]?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition"
                >
                  <Icon size={11} />
                  {s.title.split(" ").slice(0, 3).join(" ")}
                  {s.badge && (
                    <span className="bg-amber-500 text-[#22323c] text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      {s.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
              Find us on
            </p>
            <a
              href="https://instagram.com/myraanshika"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-pink-400 transition"
            >
              <FaInstagram size={15} className="text-pink-400" /> Instagram
            </a>
            <a
              href="https://t.me/Myraanshika"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-blue-400 transition"
            >
              <FaTelegram size={15} className="text-blue-400" /> Telegram
            </a>
            <a
              href="https://wa.me/917982670413"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-[#17d492] transition"
            >
              <FaWhatsapp size={15} className="text-[#17d492]" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        {SECTIONS.map((section) => {
          const SectionIcon = SECTION_ICONS[section.id] || FaFileAlt;
          return (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className={`rounded-2xl border ${section.borderColor} ${section.bgColor} p-6 scroll-mt-24`}
            >
              {/* Section header */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: section.color + "20",
                      border: `1px solid ${section.color}30`,
                    }}
                  >
                    <SectionIcon size={18} style={{ color: section.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-white">
                        {section.title}
                      </h2>
                      {section.badge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-[#22323c]">
                          {section.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {section.items.length} services available
                    </p>
                  </div>
                </div>
                {section.isLink && (
                  <Link
                    href={section.linkHref}
                    className="shrink-0 flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl border text-[#17d492] border-[#17d492]/30 hover:bg-[#17d492]/10 transition"
                  >
                    {section.linkLabel} <FaArrowRight size={10} />
                  </Link>
                )}
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-5">
                {section.items.map((item) => {
                  const ItemIcon = ITEM_ICONS[item] || FaFileAlt;
                  return (
                    <div
                      key={item}
                      className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2.5 text-sm text-slate-300"
                    >
                      <ItemIcon
                        size={12}
                        className="shrink-0"
                        style={{ color: section.color }}
                      />
                      {item}
                    </div>
                  );
                })}
              </div>

              {/* Contact CTA */}
              {/* Contact CTA */}
              {section.contact && (
                <a
                  href="https://wa.me/917982670413"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-xl transition"
                  style={{
                    backgroundColor: section.color + "20",
                    color: section.color,
                    border: `1px solid ${section.color}40`,
                  }}
                >
                  <FaWhatsapp size={15} />
                  WhatsApp to Enquire
                </a>
              )}

              {(section.instagramLink || section.telegramLink) && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {section.instagramLink && (
                    <a
                      href={section.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-xl transition bg-pink-500/15 text-pink-400 border border-pink-500/30 hover:bg-pink-500/25"
                    >
                      <FaInstagram size={15} />
                      Instagram
                    </a>
                  )}
                  {section.telegramLink && (
                    <a
                      href={section.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-xl transition bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25"
                    >
                      <FaTelegram size={15} />
                      Telegram
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-16 text-center">
        <div className="bg-[#1a2830] border border-[#17d492]/15 rounded-2xl px-6 py-8">
          <p className="text-2xl font-black text-white mb-2">
            Don't see what you need?
          </p>
          <p className="text-slate-500 text-sm mb-5">
            We deliver almost everything for students. Just message us!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/917982670413"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#17d492] text-[#22323c] px-6 py-3 rounded-xl font-black hover:bg-[#14b87e] transition"
            >
              <FaWhatsapp size={16} /> WhatsApp: 7982670413
            </a>
            <a
              href="https://www.instagram.com/kapilstore.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-pink-500/15 text-pink-400 border border-pink-500/30 px-6 py-3 rounded-xl font-black hover:bg-pink-500/25 transition"
            >
              <FaInstagram size={16} /> Instagram
            </a>
            <a
              href="https://t.me/kapilstore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500/15 text-blue-400 border border-blue-500/30 px-6 py-3 rounded-xl font-black hover:bg-blue-500/25 transition"
            >
              <FaTelegram size={16} /> Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
