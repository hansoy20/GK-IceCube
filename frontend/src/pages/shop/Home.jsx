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
      <section className="relative overflow-hidden px-6 pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24 lg:pt-16 lg:pb-32 bg-white border-b border-gray-100">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary-light/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Column */}
          <div className="flex flex-col items-start text-left relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center rounded-full border border-primary bg-white px-3 py-1 text-sm font-medium text-secondary mb-6 tracking-wide">
              Fast, reliable ice delivery
            </div>
            <h1 className="font-heading text-[3.5rem] sm:text-7xl font-bold leading-[0.95] tracking-tight text-neutral-heading mb-4 uppercase">
              GK Ice Cube<br/><span className="text-primary">Premium</span> Supplier
            </h1>
            <p className="text-xl text-neutral-body leading-relaxed mb-8">
              Crystal clear ice cubes delivered straight to your door at just ₱8 per kilo.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-6 animate-fade-in-up-delay-1">
              <Link to="/order" className="rounded-lg bg-primary px-8 py-4 text-lg font-bold text-white shadow-sm hover:shadow-lg hover:bg-primary-dark hover:scale-[1.02] transition-all duration-200">
                Order Now
              </Link>
              <a href="#contact" className="rounded-lg border border-secondary px-8 py-4 text-lg font-bold text-secondary hover:bg-secondary hover:text-white hover:scale-[1.02] hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                 Contact Us
              </a>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-neutral-body">

              <div className="flex items-center gap-1.5">
                <IconCashBanknote size={16} />
                Cash on delivery
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex justify-center lg:justify-end w-full">
            <div className="bg-primary-light/20 rounded-2xl p-8 flex items-center justify-center">
              <img 
                src="/icecubes_nobg.png" 
                alt="Crystal clear floating ice cubes" 
                className="w-full max-w-lg object-contain drop-shadow-[0_20px_30px_rgba(59,158,232,0.25)]" 
              />
            </div>
          </div>
        </div>
      </section>

      <ValueProps />

      {/* Trust Strip Below Fold */}
      <section id="contact" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-br from-secondary-dark via-[#1a2c47] to-secondary text-white py-12 sm:py-16 md:py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
            <Snowflake size={32} className="text-primary" />
            <h3 className="font-heading font-bold text-2xl tracking-wide uppercase text-center md:text-left">Good for Sari Sari Stores!</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center">
             <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="font-bold text-sm uppercase tracking-widest text-white/60">Call us:</span>
                <a href="tel:09618310181" className="font-mono text-xl font-bold hover:text-primary transition-colors">0961 831 0181</a>
                <span className="text-white/30 px-2">|</span>
                <a href="tel:09756830260" className="font-mono text-xl font-bold hover:text-primary transition-colors">0975 683 0260</a>
             </div>
             <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white text-secondary px-5 py-2 rounded-lg font-bold hover:bg-gray-100 hover:scale-[1.02] hover:shadow-lg transition-all duration-200">
                <MessageCircle size={18} />
                Message Us
             </a>
          </div>
        </div>
      </section>
    </div>
  );
}
