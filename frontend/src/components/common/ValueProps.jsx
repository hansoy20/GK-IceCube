import { IconClock, IconCurrencyPeso, IconShieldCheck } from "@tabler/icons-react";
import { Snowflake } from "lucide-react";

export default function ValueProps() {
  return (
    <section className="bg-primary-light py-12 sm:py-16 md:py-24 lg:py-32 px-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {/* Same-day delivery */}
        <div className="flex flex-col items-center group hover:-translate-y-1 transition-all duration-300 cursor-default">
          <div className="bg-white p-6 rounded-full mb-6 shadow-sm ring-2 ring-primary/10 group-hover:bg-primary/5 transition-colors relative overflow-hidden flex items-center justify-center w-20 h-20">
            <Snowflake size={60} className="absolute text-primary/10 -rotate-12 scale-150 pointer-events-none" />
            <IconClock size={40} className="text-primary relative z-10" stroke={1.5} />
          </div>
          <h3 className="font-heading text-xl font-bold text-neutral-heading mb-2">Same-day delivery</h3>
          <p className="text-neutral-body font-medium">Order early, get it delivered today</p>
        </div>

        {/* Fair pricing */}
        <div className="flex flex-col items-center group hover:-translate-y-1 transition-all duration-300 cursor-default">
          <div className="bg-white p-6 rounded-full mb-6 shadow-sm ring-2 ring-primary/10 group-hover:bg-primary/5 transition-colors relative overflow-hidden flex items-center justify-center w-20 h-20">
            <Snowflake size={60} className="absolute text-primary/10 -rotate-12 scale-150 pointer-events-none" />
            <IconCurrencyPeso size={40} className="text-primary relative z-10" stroke={1.5} />
          </div>
          <h3 className="font-heading text-xl font-bold text-neutral-heading mb-2">₱8 per kilo, no minimums</h3>
          <p className="text-neutral-body font-medium">Fair pricing for any order size</p>
        </div>

        {/* Quality */}
        <div className="flex flex-col items-center group hover:-translate-y-1 transition-all duration-300 cursor-default">
          <div className="bg-white p-6 rounded-full mb-6 shadow-sm ring-2 ring-primary/10 group-hover:bg-primary/5 transition-colors relative overflow-hidden flex items-center justify-center w-20 h-20">
            <Snowflake size={60} className="absolute text-primary/10 -rotate-12 scale-150 pointer-events-none" />
            <IconShieldCheck size={40} className="text-primary relative z-10" stroke={1.5} />
          </div>
          <h3 className="font-heading text-xl font-bold text-neutral-heading mb-2">Sealed and sanitized</h3>
          <p className="text-neutral-body font-medium">Packed cold, ready to sell</p>
        </div>
      </div>
    </section>
  );
}
