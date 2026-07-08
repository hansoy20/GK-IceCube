import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { MessageCircle, Snowflake } from "lucide-react";
import { IconWallet, IconCashBanknote } from "@tabler/icons-react";
import ValueProps from "../../components/common/ValueProps";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.substring(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location.hash]);

  return (
    <div>
      {/* 2-Column Hero */}
      <section className="px-6 py-12 md:py-20 lg:py-24 border-b border-slate-200">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-secondary mb-6 shadow-sm">
              Fast, reliable ice delivery
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-black leading-tight tracking-tight text-secondary mb-4 uppercase">
              GK Ice Cube Co.<br/>Purified Wholesale
            </h1>
            <p className="text-xl text-secondary/80 font-medium mb-8">
              Crystal clear ice cubes delivered straight to your door at just ₱8 per kilo.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link to="/order" className="rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-sm hover:bg-primary/90 transition-all active:scale-95">
                Order Now
              </Link>
              <a href="#contact" className="rounded-full border-2 border-primary px-8 py-4 text-lg font-bold text-primary hover:bg-primary/5 transition-colors flex items-center gap-2">
                 Contact Us
              </a>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-secondary/60">
              <div className="flex items-center gap-1.5">
                <IconWallet size={16} />
                GCash accepted
              </div>
              <div className="flex items-center gap-1.5">
                <IconCashBanknote size={16} />
                Cash on delivery
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex justify-center lg:justify-end">
            <img 
              src="/icecubes_nobg.png" 
              alt="Crystal clear floating ice cubes" 
              className="w-full max-w-lg object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]" 
            />
          </div>
        </div>
      </section>

      <ValueProps />

      {/* Trust Strip Below Fold */}
      <section id="contact" className="scroll-mt-20 bg-secondary text-white py-12 md:py-20 px-6 border-b-4 border-primary">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Snowflake size={32} className="text-primary" />
            <h3 className="font-display font-black text-2xl tracking-wide uppercase text-center md:text-left">Good for Sari Sari Stores!</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center">
             <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="font-bold text-sm uppercase tracking-widest text-white/60">Call us:</span>
                <a href="tel:09618310181" className="font-mono text-xl font-bold hover:text-primary transition-colors">0961 831 0181</a>
                <span className="text-white/30 px-2">|</span>
                <a href="tel:09756830260" className="font-mono text-xl font-bold hover:text-primary transition-colors">0975 683 0260</a>
             </div>
             <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white text-secondary px-5 py-2 rounded-full font-bold hover:bg-slate-100 transition-colors shadow-sm">
                <MessageCircle size={18} />
                Message Us
             </a>
          </div>
        </div>
      </section>
    </div>
  );
}
