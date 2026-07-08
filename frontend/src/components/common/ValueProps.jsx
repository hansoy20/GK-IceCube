import { IconClock, IconCurrencyPeso, IconShieldCheck } from "@tabler/icons-react";

export default function ValueProps() {
  return (
    <section className="bg-slate-50/50 py-12 md:py-20 px-6 border-b border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {/* Same-day delivery */}
        <div className="flex flex-col items-center">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <IconClock size={40} className="text-primary" stroke={1.5} />
          </div>
          <h3 className="font-display text-xl font-bold text-secondary mb-2">Same-day delivery</h3>
          <p className="text-secondary/80 font-medium">Order early, get it delivered today</p>
        </div>

        {/* Fair pricing */}
        <div className="flex flex-col items-center">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <IconCurrencyPeso size={40} className="text-primary" stroke={1.5} />
          </div>
          <h3 className="font-display text-xl font-bold text-secondary mb-2">₱8 per kilo, no minimums</h3>
          <p className="text-secondary/80 font-medium">Fair pricing for any order size</p>
        </div>

        {/* Quality */}
        <div className="flex flex-col items-center">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <IconShieldCheck size={40} className="text-primary" stroke={1.5} />
          </div>
          <h3 className="font-display text-xl font-bold text-secondary mb-2">Sealed and sanitized</h3>
          <p className="text-secondary/80 font-medium">Packed cold, ready to sell</p>
        </div>
      </div>
    </section>
  );
}
