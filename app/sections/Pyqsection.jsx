"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FaFilePdf,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaSearch,
  FaGraduationCap,
} from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";

const PYQSection = () => {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDept, setOpenDept] = useState(null);
  const [search, setSearch] = useState("");

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

  // Group by department
  const grouped = useMemo(() => {
    const filtered = pyqs.filter(
      (p) =>
        !search ||
        p.subject.toLowerCase().includes(search.toLowerCase()) ||
        p.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
        p.department.toLowerCase().includes(search.toLowerCase()) ||
        p.branch.toLowerCase().includes(search.toLowerCase()),
    );

    return filtered.reduce((acc, pyq) => {
      if (!acc[pyq.department]) acc[pyq.department] = [];
      acc[pyq.department].push(pyq);
      return acc;
    }, {});
  }, [pyqs, search]);

  const departments = Object.keys(grouped);

  // Auto-open first dept on load
  useEffect(() => {
    if (departments.length > 0 && !openDept) {
      setOpenDept(departments[0]);
    }
  }, [departments]);

  return (
    <section id="pyqs" className="bg-[#1a2830] py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <MdMenuBook className="text-[#17d492] text-4xl" />
            <h2 className="text-3xl font-bold text-[#17d492]">
              Previous Year Questions
            </h2>
          </div>
          <p className="text-[#f5f5f5]/60 text-sm">
            Download PYQs department-wise. Study smart, score high.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full sm:w-2/3">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#17d492]/60 text-sm" />
            <input
              type="text"
              placeholder="Search by subject, code, department..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenDept(null);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg
                border border-[#17d492]/30
                focus:outline-none focus:ring-2 focus:ring-[#17d492]
                text-white bg-[#22323c] placeholder:text-white/30 text-sm"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-white/50 text-sm">Loading PYQs...</p>
        )}

        {/* Empty */}
        {!loading && pyqs.length === 0 && (
          <div className="text-center py-16">
            <FaGraduationCap className="text-[#17d492]/30 text-6xl mx-auto mb-4" />
            <p className="text-white/40">
              No PYQs uploaded yet. Check back soon!
            </p>
          </div>
        )}

        {/* No results */}
        {!loading && pyqs.length > 0 && departments.length === 0 && (
          <p className="text-center text-white/40 py-10">
            No results for "{search}"
          </p>
        )}

        {/* Department Accordion */}
        {!loading && departments.length > 0 && (
          <div className="space-y-3">
            {departments.map((dept) => {
              const isOpen = openDept === dept;
              const items = grouped[dept];

              return (
                <div
                  key={dept}
                  className="rounded-xl border border-[#17d492]/20 overflow-hidden"
                >
                  {/* Department Header */}
                  <button
                    onClick={() => setOpenDept(isOpen ? null : dept)}
                    className="w-full flex items-center justify-between px-5 py-4 
                      bg-[#22323c] hover:bg-[#2a3f4a] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FaGraduationCap className="text-[#17d492] text-lg shrink-0" />
                      <span className="font-semibold text-[#f5f5f5] text-left">
                        {dept}
                      </span>
                      <span className="bg-[#17d492]/15 text-[#17d492] text-xs px-2 py-0.5 rounded-full font-medium">
                        {items.length} {items.length === 1 ? "file" : "files"}
                      </span>
                    </div>
                    {isOpen ? (
                      <FaChevronUp className="text-[#17d492] text-sm shrink-0" />
                    ) : (
                      <FaChevronDown className="text-[#17d492]/50 text-sm shrink-0" />
                    )}
                  </button>

                  {/* PYQ List */}
                  {isOpen && (
                    <div className="bg-[#1e2f38] divide-y divide-[#17d492]/10">
                      {items.map((pyq) => (
                        <div
                          key={pyq._id}
                          className="flex items-center justify-between px-5 py-3.5 
                            hover:bg-[#22323c]/60 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FaFilePdf className="text-red-400 text-base shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[#f5f5f5] text-sm font-medium truncate">
                                {pyq.fileName}
                              </p>
                              <p className="text-[#f5f5f5]/40 text-xs mt-0.5">
                                {pyq.year} • {pyq.branch}
                              </p>
                            </div>
                          </div>

                          <a
                            href={pyq.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold
                              bg-[#17d492] text-[#22323c] px-3 py-1.5 rounded-lg
                              hover:opacity-90 transition shrink-0 ml-4"
                          >
                            <FaDownload className="text-xs" />
                            <span className="hidden sm:inline">Open</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PYQSection;
