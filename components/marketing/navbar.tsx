import React from "react";
import Link from "next/link";
import { Sprout, Phone, ShieldCheck, ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo RAWeiD */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.jpg"
            alt="Logo RAWeiD"
            className="w-11 h-11 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="text-xl font-black text-[#1B4D3E] tracking-tight block leading-none">
              RAWeiD <span className="text-[#C49A45]">SERVICE</span>
            </span>
            <span className="text-[10px] text-stone-500 font-medium tracking-wider uppercase block mt-1">
              Agro-Consulting & Nutrition
            </span>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-stone-700 tracking-wide uppercase">
          <a href="#services" className="hover:text-[#1B4D3E] transition-colors">
            Nos Services
          </a>
          <a href="#formations" className="hover:text-[#1B4D3E] transition-colors">
            Formations
          </a>
          <a href="#aliments" className="hover:text-[#1B4D3E] transition-colors">
            Aliments Siliana
          </a>
          <a href="#realisations" className="hover:text-[#1B4D3E] transition-colors">
            Vidéos & Réalisations
          </a>
          
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+21698000000"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#1B4D3E]"
          >
            <Phone className="w-3.5 h-3.5 text-[#C49A45]" />
            <span>Contact Direct</span>
          </a>
          <a
            href="#inscription"
            className="px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <span>S&apos;inscrire / Devis</span>
            <ArrowRight className="w-3 h-3 text-[#C49A45]" />
          </a>
        </div>
      </div>
    </header>
  );
}
