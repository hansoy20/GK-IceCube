export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-background text-neutral-body">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-heading font-bold text-lg tracking-tight text-neutral-heading">GK Ice Cube Co.</p>
          <p className="font-medium text-neutral-body/80">Same-day ice delivery, packed and dispatched cold every time.</p>
        </div>
        <p className="mt-8 text-xs uppercase tracking-wider text-neutral-body/60 font-medium">© {new Date().getFullYear()} GK Ice Cube Co. All rights reserved.</p>
      </div>
    </footer>
  );
}
