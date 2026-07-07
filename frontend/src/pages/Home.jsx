import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import client from "../api/client";
import { Phone, MessageCircle, Snowflake } from "lucide-react";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.substring(1));
      if (el) {
        // slight timeout to let products load before scrolling if deep linking
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location.hash]);

  return (
    <div>
      {/* 2-Column Hero */}
      <section className="relative overflow-hidden border-b border-primary/10 px-6 py-20 lg:py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="flex flex-col items-start text-left">
            <h1 className="font-display text-5xl sm:text-6xl font-black leading-tight tracking-tight text-secondary mb-4 uppercase">
              GK Ice Cube Co.<br/>Purified Wholesale
            </h1>
            <p className="text-xl text-secondary/80 font-medium mb-8">
              Crystal clear ice cubes delivered straight to your door at just ₱8 per kilo.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/order" className="rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-primary-hover transition-all active:scale-95">
                Order Now
              </Link>
              <a href="#contact" className="text-lg font-bold text-secondary hover:text-primary transition-colors flex items-center gap-2">
                 Contact Us
              </a>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex justify-center lg:justify-end">
            <img src="/hero.png" alt="Crystal clear ice cubes" className="w-full max-w-lg rounded-2xl shadow-2xl border-4 border-white object-cover aspect-square" />
          </div>
        </div>
      </section>

      {/* Trust Strip Below Fold */}
      <section id="contact" className="scroll-mt-20 bg-primary text-white py-8 px-6 border-b-4 border-primary-hover">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Snowflake size={32} className="animate-spin-slow" />
            <h3 className="font-display font-black text-2xl tracking-wide uppercase text-center md:text-left">Good for Sari Sari Stores!</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center">
             <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="font-bold text-sm uppercase tracking-widest text-white/80">Call us:</span>
                <a href="tel:09618310181" className="font-mono text-xl font-bold hover:text-secondary transition-colors">0961 831 0181</a>
                <span className="text-white/50 px-2">|</span>
                <a href="tel:09756830260" className="font-mono text-xl font-bold hover:text-secondary transition-colors">0975 683 0260</a>
             </div>
             <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white text-primary px-5 py-2 rounded-full font-bold hover:bg-secondary hover:text-white transition-colors shadow-sm">
                <MessageCircle size={18} />
                Message Us
             </a>
          </div>
        </div>
      </section>
    </div>
  );
}
