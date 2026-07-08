import { Link, NavLink, useNavigate } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors ${
    isActive ? "text-primary" : "text-secondary/70 hover:text-primary"
  }`;

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="h-2 w-full bg-primary" />
      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Left: Logo & Links */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 font-display text-xl font-bold text-secondary tracking-tight"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="grid h-7 w-7 grid-cols-2 gap-0.5">
                <span className="bg-primary/80 rounded-[2px]" />
                <span className="bg-primary/60 rounded-[2px]" />
                <span className="bg-primary/60 rounded-[2px]" />
                <span className="bg-primary/40 rounded-[2px]" />
              </span>
              GK Ice Cube Co.
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <NavLink 
                to="/" 
                className={navLinkClass} 
                end
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Home
              </NavLink>
              <NavLink 
                to="/order" 
                className={navLinkClass}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Order Now
              </NavLink>
              <a href="/#contact" className={navLinkClass({isActive: false})}>
                Contact
              </a>
            </nav>
          </div>

        {/* Right: Auth placeholder */}
        <div className="flex items-center justify-end gap-5">
          {/* You could add a login link here later if needed */}
        </div>
      </div>
      </header>
    </>
  );
}
