import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#1a2830] text-[#f5f5f5] pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-black tracking-tighter text-[#17d492]">
              Kapil<span className="text-white"> Store</span>
            </h2>
            <p className="text-sm mt-4 text-slate-400 leading-relaxed font-medium">
              Jamia Students ka All-in-One Online Store Food • Grocery •
              Stationery • Essentials Fast Delivery | Lowest Prices | Student
              Powered Built by a Jamia Student for Jamia Students
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: <FaFacebookF />, link: "#" },
                {
                  icon: <FaInstagram />,
                  link: "https://www.instagram.com/calmand_cool?igsh=MWpocHNnazNxaWwxZg==",
                },
                {
                  icon: <FaWhatsapp />,
                  link: "https://chat.whatsapp.com/Di7XVQjwzbf3yTEiX71tUS",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center bg-slate-800 text-[#17d492] rounded-xl hover:bg-[#17d492] hover:text-[#22323c] transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#17d492] mb-6">
              Explore
            </h3>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              {["Home", "About", "Contact", "Track"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-px w-0 bg-[#17d492] group-hover:w-3 transition-all"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#17d492] mb-6">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <TbTruckDelivery size={20} className="text-[#17d492]" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                  Fast Delivery
                </span>
              </div>
              <a href="tel:7982670413" className="flex items-start gap-3 group">
                <IoIosCall size={20} className="text-[#17d492]" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                  +91 79826 70413
                </span>
              </a>
              <a
                href="mailto:kapilguptakapil1111@gmail.com"
                className="flex items-start gap-3 group"
              >
                <MdEmail size={20} className="text-[#17d492]" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors break-all">
                  kapilguptakapil1111@gmail.com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold tracking-widest uppercase text-slate-500">
          <p>
            © {new Date().getFullYear()} STUDENT STATIONERY. All rights
            reserved.
          </p>
          <p className="flex items-center gap-2">
            Engineered by
            <a
              href="https://www.linkedin.com/in/-mohammed-awaiz/"
              target="_blank"
              className="text-[#17d492] hover:underline underline-offset-4"
            >
              Mohammed Awaiz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;