"use client";
import Link from "next/link";
import {
  FaShoppingBasket,
  FaUtensils,
  FaGlassWhiskey,
  FaPencilAlt,
  FaFileAlt,
  FaChalkboardTeacher,
  FaHome,
  FaEllipsisH,
  FaArrowRight,
} from "react-icons/fa";

const SERVICES = [
  {
    id: "stationery",
    label: "Stationery",
    desc: "Notebooks, pens, drawing materials & more",
    Icon: FaPencilAlt,
    href: "/stationery",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    badge: null,
  },
  {
    id: "assignment",
    label: "Assignment Services",
    desc: "IGNOU, handwritten, typed, drawings & projects",
    Icon: FaFileAlt,
    href: "/others#assignment",
    color: "from-purple-500/20 to-violet-500/20",
    border: "border-purple-500/30",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
    badge: "Popular",
  },
  {
    id: "Xerox & Printout",
    label: "Xerox & Printout Services",
    desc: "Document copying, printing, binding & more",
    Icon: FaFileAlt,
    href: "/others#xerox-printout",
    color: "from-gray-500/20 to-slate-500/20",
    border: "border-gray-500/30",
    iconBg: "bg-gray-500/15",
    iconColor: "text-gray-400",
    badge: null,
  },
  {
    id: "tuition",
    label: "Tuition Services",
    desc: "School, college, home tuition & IGNOU help",
    Icon: FaChalkboardTeacher,
    href: "/others#tuition",
    color: "from-cyan-500/20 to-sky-500/20",
    border: "border-cyan-500/30",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-400",
    badge: null,
  },
  {
    id: "earn-rent",
    label: "Earn & Rent Hub",
    desc: "PG rooms, electronics, calculators on rent",
    Icon: FaHome,
    href: "/others#earn-rent",
    color: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-400",
    badge: null,
  },
  {
    id: "others",
    label: "Others",
    desc: "Laundry, repair, resume, printout & much more",
    Icon: FaEllipsisH,
    href: "/others",
    color: "from-[#17d492]/20 to-teal-500/20",
    border: "border-[#17d492]/30",
    iconBg: "bg-[#17d492]/15",
    iconColor: "text-[#17d492]",
    badge: null,
  },
];

export default function ServicesPreview() {
  return (
    <section className="bg-[#22323c] py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#17d492]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#17d492]/10 border border-[#17d492]/20 text-[#17d492] text-xs font-black tracking-widest uppercase mb-4">
            <FaEllipsisH size={10} />
            Everything for Students
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            All <span className="text-[#17d492]">Services</span>
          </h2>
          <p className="text-slate-400 mt-3 font-medium max-w-xl mx-auto">
            Your one-stop student superstore — from food and groceries to
            assignments and tuition.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {SERVICES.map((service) => {
            const { Icon } = service;
            return (
              <Link
                key={service.id}
                href={service.href}
                className={`relative flex flex-col gap-3 p-4 md:p-5 rounded-2xl bg-gradient-to-br ${service.color} border ${service.border}
                  hover:scale-[1.03] hover:shadow-lg transition-all duration-200 group`}
              >
                {/* Badge */}
                {service.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider bg-[#17d492] text-[#22323c] px-2 py-0.5 rounded-full">
                    {service.badge}
                  </span>
                )}

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl ${service.iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon size={18} className={service.iconColor} />
                </div>

                {/* Text */}
                <div>
                  <p className="font-black text-sm md:text-base text-white leading-tight">
                    {service.label}
                  </p>
                  <p className="text-slate-400 text-xs mt-1 leading-snug hidden sm:block">
                    {service.desc}
                  </p>
                </div>

                {/* Arrow on hover */}
                <FaArrowRight
                  className={`${service.iconColor} text-xs mt-auto opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/others"
            className="inline-flex items-center gap-2 border border-[#17d492]/30 text-[#17d492] px-6 py-3 rounded-xl font-black text-sm hover:bg-[#17d492]/10 transition"
          >
            View All Services & Others <FaArrowRight size={11} />
          </Link>
        </div>
      </div>
    </section>
  );
}
