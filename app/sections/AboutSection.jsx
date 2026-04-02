import React from "react";
import { User, Calendar, BookOpen, Phone, PenTool, ShoppingBag, ArrowRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="aboutme" className="bg-[#22323c] py-24 px-4 relative overflow-hidden ">
      {/* Background Accent - matching the Hero's glow */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#17d492]/5 blur-[100px] rounded-full -ml-40 -mb-40"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-[#17d492] uppercase tracking-[0.3em]">Get To Know Me</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white mt-3">About Me</h3>
          <div className="h-1.5 w-16 bg-[#17d492] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Profile Card with Brand Glow */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(23,212,146,0.1)] overflow-hidden border border-white/10 mb-8 transform transition-all">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar with Hero-matching Dark shade */}
            <div className="md:w-1/3 bg-[#1a2830] flex flex-col items-center justify-center p-12 text-center border-r border-slate-100/10">
              <div className="relative">
                <div className="absolute inset-0 bg-[#17d492] blur-xl opacity-20 animate-pulse"></div>
                <div className="relative w-28 h-28 rounded-3xl bg-[#17d492] flex items-center justify-center text-4xl font-black text-[#22323c] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
                  KG
                </div>
              </div>
              <h4 className="text-white mt-8 text-2xl font-black tracking-tight">Kapil Gupta</h4>
              <p className="text-[#17d492] text-xs font-bold uppercase tracking-widest mt-2">The Founder</p>
            </div>

            {/* Main Content */}
            <div className="md:w-2/3 p-10 md:p-14 bg-white">
              <h3 className="text-3xl font-black text-slate-900 leading-tight">
                Hello, 
                <span className="text-[#17d492]"> I'm Kapil!</span>
              </h3>
              <p className="mt-6 text-slate-600 leading-relaxed font-medium">
                Currently a 2nd-year B.Tech student at Jamia Millia Islamia (ECE).
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#17d492]/30 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <BookOpen size={20} className="text-[#17d492]" />
                  </div>
                  <span className="text-slate-700 font-bold text-sm">ECE Branch</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#17d492]/30 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar size={20} className="text-[#17d492]" />
                  </div>
                  <span className="text-slate-700 font-bold text-sm">2024 – 28 Batch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Academic Card */}
          <div className="group bg-slate-800/40 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-700 hover:border-[#17d492] transition-all duration-300 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-[#17d492] rounded-2xl text-[#22323c] shadow-[0_0_20px_rgba(23,212,146,0.3)]">
                <PenTool size={24} />
              </div>
              <h4 className="font-black text-xl text-white">Academic Work</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Assignments, Written work, Drawings, or Projects. High-quality work tailored to all the deparements, like POLYTECHNIC, BTECH, ARCHITECTURE etc.
            </p>
            <a href="tel:7982670413" className="inline-flex items-center gap-2 text-[#17d492] text-xs font-black tracking-widest uppercase group-hover:gap-4 transition-all">
            </a>
          </div>

          {/* Stationery Card */}
          <div className="group bg-slate-800/40 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-700 hover:border-white transition-all duration-300 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-white rounded-2xl text-[#22323c]">
                <ShoppingBag size={24} />
              </div>
              <h4 className="font-black text-xl text-white">Materials</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                If any stationery item or assignment-related material is not available on the website, simply message me — I’ll arrange that product and deliver it specially for you.
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 text-white text-xs font-black tracking-widest uppercase group-hover:gap-4 transition-all">
            </a>
          </div>
        </div>
        
        {/* Final CTA - Matching Hero Button Style */}
        <div id="Phone" className="mt-16 text-center">
          <a href="tel:7982670413" className="inline-flex flex-col sm:flex-row items-center gap-2 bg-[#17d492] text-[#22323c] px-10 py-5 rounded-2xl font-black text-lg shadow-[0_20px_40px_rgba(23,212,146,0.3)] hover:scale-105 hover:bg-[#1ee8a1] transition-all">
             <span>Contact via WhatsApp / Call</span>
             <span className="hidden sm:inline opacity-30 text-2xl font-light">|</span>
             <span>+91 7982670413</span>
          </a>
          <p className="mt-6 text-slate-500 text-sm font-bold tracking-tight">Available for all Jamia Students (24/7 Support)</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;