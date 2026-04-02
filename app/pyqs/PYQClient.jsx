"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FaFilePdf,
  FaDownload,
  FaSearch,
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp,
  FaBookOpen,
  FaHome,
} from "react-icons/fa";
import { MdMenuBook, MdOutlineFilterList } from "react-icons/md";
import { HiOutlineDocumentSearch } from "react-icons/hi";

export default function PYQClient() {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openDept, setOpenDept] = useState(null);
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    async function fetchPYQs() {
      try {
        const res = await fetch("/api/pyqs");
        const data = await res.json();
        setPyqs(Array.isArray(data) ? data : []);
      } catch {
        setPyqs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPYQs();
  }, []);

  // All unique years for filter
  const allYears = useMemo(() => {
    const years = [...new Set(pyqs.map((p) => p.year))].sort((a, b) => b - a);
    return years;
  }, [pyqs]);

  // Filtered + grouped
  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = pyqs.filter((p) => {
      const matchSearch =
        !q ||
        p.subject?.toLowerCase().includes(q) ||
        p.subjectCode?.toLowerCase().includes(q) ||
        p.department?.toLowerCase().includes(q) ||
        p.branch?.toLowerCase().includes(q) ||
        p.fileName?.toLowerCase().includes(q);
      const matchYear = yearFilter === "all" || p.year === yearFilter;
      return matchSearch && matchYear;
    });

    return filtered.reduce((acc, pyq) => {
      if (!acc[pyq.department]) acc[pyq.department] = [];
      acc[pyq.department].push(pyq);
      return acc;
    }, {});
  }, [pyqs, search, yearFilter]);

  const departments = Object.keys(grouped);
  const totalFiles = Object.values(grouped).flat().length;

  // Auto-open first dept
  useEffect(() => {
    if (departments.length > 0 && openDept === null) {
      setOpenDept(departments[0]);
    }
  }, [departments]);

  // Reset open dept on search change
  useEffect(() => {
    if (departments.length > 0) setOpenDept(departments[0]);
    else setOpenDept(null);
  }, [search, yearFilter]);

  return (
    <div className="min-h-screen bg-[#22323c] text-[#f5f5f5]">
      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-[#1a2830] border-b border-white/5">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#17d492 1px, transparent 1px), linear-gradient(90deg, #17d492 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#17d492]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-32 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#17d492]/10 border border-[#17d492]/20 rounded-full px-4 py-1.5 mb-6">
            <MdMenuBook className="text-[#17d492] text-sm" />
            <span className="text-[#17d492] text-xs font-bold uppercase tracking-widest">
              Free for all students
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Previous Year
            <span className="text-[#17d492]"> Questions</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-8">
            Department-wise PYQs for Jamia Millia Islamia. Download, study
            smart, and ace your exams.
          </p>

          {/* Stats */}
          {!loading && pyqs.length > 0 && (
            <div className="flex items-center justify-center gap-6 mb-2">
              <div className="text-center">
                <p className="text-2xl font-black text-[#17d492]">
                  {pyqs.length}
                </p>
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  Papers
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-black text-[#17d492]">
                  {[...new Set(pyqs.map((p) => p.department))].length}
                </p>
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  Departments
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-black text-[#17d492]">
                  {allYears.length > 0 ? allYears[allYears.length - 1] : "–"}–
                  {allYears[0] || "–"}
                </p>
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  Years
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="sticky top-16 z-30 bg-[#22323c]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#17d492]/50 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Search subject, code, department, branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a2830] border border-white/10
                focus:outline-none focus:border-[#17d492] text-white placeholder:text-white/25
                text-sm transition"
            />
          </div>

          {/* Year filter */}
          {allYears.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 shrink-0">
              <MdOutlineFilterList className="text-[#17d492] shrink-0 text-base" />
              {["all", ...allYears].map((y) => (
                <button
                  key={y}
                  onClick={() => setYearFilter(y)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition ${
                    yearFilter === y
                      ? "bg-[#17d492] text-[#22323c]"
                      : "bg-[#1a2830] text-slate-400 border border-white/10 hover:border-[#17d492]/40"
                  }`}
                >
                  {y === "all" ? "All Years" : y}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-4 border-[#17d492] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/40 text-sm">Loading question papers...</p>
          </div>
        )}

        {/* Empty — no PYQs at all */}
        {!loading && pyqs.length === 0 && (
          <div className="text-center py-32">
            <HiOutlineDocumentSearch className="text-[#17d492]/20 text-8xl mx-auto mb-6" />
            <p className="text-white/40 text-lg font-bold">
              No papers uploaded yet.
            </p>
            <p className="text-white/20 text-sm mt-2">
              Check back soon — we're adding more!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-8 bg-[#17d492] text-[#22323c] px-6 py-3 rounded-xl font-black hover:bg-[#14b87e] transition"
            >
              <FaHome size={14} /> Back to Home
            </Link>
          </div>
        )}

        {/* No search results */}
        {!loading && pyqs.length > 0 && departments.length === 0 && (
          <div className="text-center py-24">
            <FaSearch className="text-[#17d492]/20 text-6xl mx-auto mb-5" />
            <p className="text-white/40 font-bold text-lg">
              No results for "{search}"
            </p>
            <button
              onClick={() => {
                setSearch("");
                setYearFilter("all");
              }}
              className="mt-4 text-[#17d492] text-sm font-bold underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Results count when filtering */}
        {!loading &&
          (search || yearFilter !== "all") &&
          departments.length > 0 && (
            <p className="text-slate-500 text-sm mb-5 font-bold">
              Showing <span className="text-[#17d492]">{totalFiles}</span>{" "}
              result{totalFiles !== 1 ? "s" : ""}
              {search && (
                <>
                  {" "}
                  for "<span className="text-white">{search}</span>"
                </>
              )}
              {yearFilter !== "all" && (
                <>
                  {" "}
                  · <span className="text-white">{yearFilter}</span>
                </>
              )}
            </p>
          )}

        {/* Department Accordions */}
        {!loading && departments.length > 0 && (
          <div className="space-y-3">
            {departments.map((dept, deptIdx) => {
              const isOpen = openDept === dept;
              const items = grouped[dept];

              return (
                <div
                  key={dept}
                  className="rounded-2xl border border-white/5 overflow-hidden"
                  style={{ animationDelay: `${deptIdx * 60}ms` }}
                >
                  {/* Department header */}
                  <button
                    onClick={() => setOpenDept(isOpen ? null : dept)}
                    className="w-full flex items-center justify-between px-5 py-4
                      bg-[#1a2830] hover:bg-[#1e3040] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl bg-[#17d492]/10 border border-[#17d492]/20
                        flex items-center justify-center shrink-0 group-hover:bg-[#17d492]/15 transition"
                      >
                        <FaGraduationCap className="text-[#17d492] text-sm" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-white text-sm md:text-base">
                          {dept}
                        </p>
                        <p className="text-xs text-slate-500">
                          {items.length}{" "}
                          {items.length === 1 ? "paper" : "papers"}
                          {" · "}
                          {[...new Set(items.map((i) => i.branch))].join(", ")}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isOpen
                          ? "bg-[#17d492]/20 text-[#17d492]"
                          : "bg-white/5 text-slate-500 group-hover:bg-white/10"
                      }`}
                    >
                      {isOpen ? (
                        <FaChevronUp size={11} />
                      ) : (
                        <FaChevronDown size={11} />
                      )}
                    </div>
                  </button>

                  {/* Papers list */}
                  {isOpen && (
                    <div className="bg-[#16252d] divide-y divide-white/[0.04]">
                      {/* Column headers */}
                      <div className="px-5 py-2 hidden sm:grid grid-cols-12 gap-3">
                        <p className="col-span-6 text-xs text-slate-600 font-black uppercase tracking-wider">
                          File
                        </p>
                        <p className="col-span-2 text-xs text-slate-600 font-black uppercase tracking-wider">
                          Branch
                        </p>
                        <p className="col-span-2 text-xs text-slate-600 font-black uppercase tracking-wider">
                          Year
                        </p>
                        <p className="col-span-2 text-xs text-slate-600 font-black uppercase tracking-wider text-right">
                          Action
                        </p>
                      </div>

                      {items.map((pyq, idx) => (
                        <div
                          key={pyq._id}
                          className="px-5 py-3.5 flex sm:grid sm:grid-cols-12 items-center gap-3
                            hover:bg-[#1a2830]/60 transition-colors group"
                        >
                          {/* Icon + name */}
                          <div className="flex items-center gap-3 sm:col-span-6 min-w-0 flex-1">
                            <div
                              className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20
                              flex items-center justify-center shrink-0"
                            >
                              <FaFilePdf className="text-red-400 text-xs" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-sm font-bold truncate">
                                {pyq.fileName}
                              </p>
                              <p className="text-slate-500 text-xs sm:hidden mt-0.5">
                                {pyq.branch} · {pyq.year}
                              </p>
                            </div>
                          </div>

                          {/* Branch */}
                          <div className="hidden sm:block sm:col-span-2">
                            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg font-bold">
                              {pyq.branch}
                            </span>
                          </div>

                          {/* Year */}
                          <div className="hidden sm:block sm:col-span-2">
                            <span className="text-xs text-slate-400 font-bold">
                              {pyq.year}
                            </span>
                          </div>

                          {/* Download */}
                          <div className="sm:col-span-2 flex justify-end shrink-0">
                            <a
                              href={pyq.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-black
                                bg-[#17d492] text-[#22323c] px-3 py-2 rounded-xl
                                hover:bg-[#14b87e] active:scale-95 transition"
                            >
                              <FaDownload size={10} />
                              <span>Download</span>
                            </a>
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

        {/* Bottom CTA */}
        {!loading && pyqs.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-block bg-[#1a2830] border border-[#17d492]/15 rounded-2xl px-8 py-6">
              <FaBookOpen className="text-[#17d492] text-2xl mx-auto mb-3" />
              <p className="text-white font-black mb-1">Need more resources?</p>
              <p className="text-slate-500 text-sm mb-4">
                Message us on WhatsApp to request specific papers.
              </p>
              <a
                href="https://wa.me/917982670413"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#17d492] text-[#22323c]
                  px-5 py-2.5 rounded-xl font-black hover:bg-[#14b87e] transition text-sm"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
