export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 text-secondary">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-display font-bold text-lg tracking-tight">GK Ice Cube Co.</p>
          <p className="font-medium text-secondary/70">Same-day ice delivery, packed and dispatched cold every time.</p>
        </div>
        <p className="mt-8 text-secondary/50 font-medium">© {new Date().getFullYear()} GK Ice Cube Co. All rights reserved.</p>
      </div>
    </footer>
  );
}
