"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const BLINK_TERMS = [
  "Open 24/7 for Jamia Students",
  "Lowest Printout Price Within Jamia — Just ₹4/Colour Page",
  "All Stationery Items at the Lowest Price",
  "Free Delivery for Jamia Students",
];

const SERVICES = [
  { label: "Tuition", href: "/others#tuition" },
  { label: "Assignment", href: "/others#assignment" },
  { label: "Stationery", href: "/stationery" },
  { label: "Room / PG", href: "/others#earn-rent" },
  { label: "Rent Services", href: "/others#earn-rent" },
  { label: "PYQs", href: "/pyqs" },
  { label: "Xerox Services", href: "/others#xerox-printout" }, 
];

const ASSIGNMENT_BULLETS = [
  "Engineering Drawing & Architecture Drafts",
  "All Types of Handwritten Assignments",
  "IGNOU & School Assignments",
  "Thesis & Research Documentation",
  "Presentations & PPT Design",
  "Project Work & Reports",
  "Important Question Solving",
  "B.Tech & Polytechnic Assignments",
  "Drawing & Sketching Work",
];

const Hero = () => {
  const [blinkIndex, setBlinkIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setBlinkIndex((prev) => (prev + 1) % BLINK_TERMS.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-root">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="grid-overlay" />

      <div className="hero-inner">

        {/* ── Left column ── */}
        <div className="hero-left">
          <h1 className="heading">
            <span className="heading-script">Official Assignment</span>
            <span className="heading-amp">&amp;</span>
            <span className="heading-script">Stationery Hub</span>
          </h1>

          <p className="price-line">
            Handwritten Assignments Starting at Just{" "}
            <span className="price-highlight">₹5 – ₹10</span> per Page
          </p>

          <p className="credit">
            by{" "}
            <Link href="/#aboutme" className="credit-name">
              Kapil Gupta
            </Link>
          </p>

          <ul className="bullet-list">
            {ASSIGNMENT_BULLETS.map((item) => (
              <li key={item} className="bullet-item">
                <span className="bullet-dot" />
                {item}
              </li>
            ))}
          </ul>

          <div className="cta-row">
            <Link href="/stationery">
              <button className="btn-primary">Explore Products</button>
            </Link>
            <Link href="https://wa.me/917982670413" target="_blank" rel="noopener noreferrer">
              <button className="btn-secondary">Contact Kapil</button>
            </Link>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="hero-right">
          <div className="services-heading">Our Services</div>
          <div className="chips-row">
            {SERVICES.map((s) => (
              <Link key={s.label} href={s.href}>
                <span className="chip">{s.label}</span>
              </Link>
            ))}
          </div>

          <div className="blink-card">
            <p
              className="blink-text"
              style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
            >
              {BLINK_TERMS[blinkIndex]}
            </p>
          </div>

          <div className="stats-row">
            <div className="stat">
              <span className="stat-num">2000+</span>
              <span className="stat-label">Students Served</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">₹4</span>
              <span className="stat-label">Colour Printout</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">24/7</span>
              <span className="stat-label">Always Open</span>
            </div>
          </div>

          <div className="social-row">
            <a href="https://www.instagram.com/kapilstore.in" target="_blank" rel="noopener noreferrer" className="social-link instagram">Instagram</a>
            <a href="https://t.me/kapilstore" target="_blank" rel="noopener noreferrer" className="social-link telegram">Telegram</a>
            <a href="https://wa.me/917982670413" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">WhatsApp</a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /*
         * ✅ FIX: White flash on refresh
         * Setting background on html + body via global style ensures
         * the dark background is applied BEFORE React hydrates,
         * so there is zero white flash on page load or refresh.
         */
        html, body {
          background-color: #0d1f2d !important;
          color: #f0f4f8;
        }
      `}</style>

      <style jsx>{`
        .hero-root {
          position: relative;
          overflow: hidden;
          background: #0d1f2d;
          min-height: 100vh;
          display: flex;
          align-items: center;
          font-family: 'Georgia', serif;
          color: #f0f4f8;
        }
        .orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(90px); }
        .orb-1 { width: 500px; height: 500px; background: rgba(23,212,146,0.12); top: -120px; right: -100px; }
        .orb-2 { width: 380px; height: 380px; background: rgba(99,179,237,0.08); bottom: -80px; left: -60px; }
        .orb-3 { width: 260px; height: 260px; background: rgba(246,173,85,0.06); top: 40%; left: 40%; }
        .grid-overlay {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(23,212,146,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(23,212,146,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .hero-inner {
          position: relative; z-index: 10;
          max-width: 1200px; margin: 0 auto;
          padding: 100px 24px 80px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: start; width: 100%;
        }
        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; gap: 48px; padding: 80px 20px 60px; }
        }
        .heading { margin: 0 0 12px; line-height: 1.15; display: flex; flex-direction: column; gap: 2px; }
        .heading-script {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: clamp(32px, 4.5vw, 54px);
          font-weight: 700; font-style: italic;
          background: linear-gradient(135deg, #ffffff 0%, #17d492 60%, #63b3ed 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          letter-spacing: -0.01em;
        }
        .heading-amp { font-size: 28px; color: rgba(23,212,146,0.5); font-style: normal; -webkit-text-fill-color: rgba(23,212,146,0.5); margin: -4px 0; }
        .price-line { font-size: 15px; color: #94a3b8; margin: 0 0 6px; font-style: italic; }
        .price-highlight { color: #f6ad55; font-weight: 700; font-style: normal; font-size: 17px; }
        .credit { font-size: 13px; color: #64748b; margin: 0 0 28px; font-family: 'Courier New', monospace; }
        .credit-name { color: #17d492; text-decoration: none; font-weight: 600; border-bottom: 1px dashed rgba(23,212,146,0.4); padding-bottom: 1px; transition: color 0.2s; }
        .credit-name:hover { color: #63b3ed; }
        .bullet-list { list-style: none; margin: 0 0 32px; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .bullet-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #cbd5e1; }
        .bullet-dot { width: 6px; height: 6px; background: #17d492; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 6px rgba(23,212,146,0.6); }
        .cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
        .btn-primary {
          background: #17d492; color: #0d1f2d; border: none;
          padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 700;
          cursor: pointer; letter-spacing: 0.02em; transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(23,212,146,0.25);
        }
        .btn-primary:hover { background: #14b87e; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(23,212,146,0.35); }
        .btn-secondary {
          background: transparent; color: #94a3b8;
          border: 1.5px solid rgba(148,163,184,0.3);
          padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: #17d492; color: #17d492; background: rgba(23,212,146,0.05); }
        .hero-right { display: flex; flex-direction: column; gap: 24px; padding-top: 8px; }
        .services-heading { font-size: 14px; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; font-family: 'Courier New', monospace; font-weight: 700; }
        .chips-row { display: flex; flex-wrap: wrap; gap: 10px 14px; margin-top: -8px; }
        .chip {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px; padding: 8px 26px; font-size: 13px; color: #94a3b8;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .chip:hover { background: rgba(23,212,146,0.1); border-color: rgba(23,212,146,0.4); color: #17d492; }
        .blink-card {
          background: rgba(23,212,146,0.06); border: 1px solid rgba(23,212,146,0.2);
          border-radius: 12px; padding: 18px 24px; min-height: 64px;
          display: flex; align-items: center; justify-content: center;
        }
        .blink-text { font-size: 14px; color: #e2e8f0; font-style: italic; line-height: 1.6; margin: 0; text-align: center; width: 100%; }
        .stats-row {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; overflow: hidden;
        }
        .stat { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 18px 12px; gap: 4px; }
        .stat-num { font-size: 24px; font-weight: 700; color: #17d492; }
        .stat-label { font-size: 11px; color: #64748b; text-align: center; font-family: 'Courier New', monospace; letter-spacing: 0.04em; }
        .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.08); flex-shrink: 0; }
        .social-row { display: flex; gap: 10px; }
        .social-link {
          flex: 1; text-align: center; padding: 10px; border-radius: 8px;
          font-size: 12px; font-weight: 600; text-decoration: none;
          letter-spacing: 0.04em; transition: all 0.2s;
          font-family: 'Courier New', monospace; text-transform: uppercase;
        }
        .instagram { background: rgba(236,72,153,0.08); border: 1px solid rgba(236,72,153,0.2); color: #f472b6; }
        .instagram:hover { background: rgba(236,72,153,0.15); }
        .telegram { background: rgba(99,179,237,0.08); border: 1px solid rgba(99,179,237,0.2); color: #63b3ed; }
        .telegram:hover { background: rgba(99,179,237,0.15); }
        .whatsapp { background: rgba(23,212,146,0.08); border: 1px solid rgba(23,212,146,0.2); color: #17d492; }
        .whatsapp:hover { background: rgba(23,212,146,0.15); }
      `}</style>
    </section>
  );
};

export default Hero;