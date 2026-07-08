import { Link, NavLink, useNavigate } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `group relative py-1 text-sm font-medium transition-all duration-200 ${
    isActive ? "text-primary font-bold active" : "text-neutral-body hover:text-primary"
  }`;

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Left: Logo & Links */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 font-heading text-xl font-bold text-neutral-heading tracking-tight"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="grid h-7 w-7 grid-cols-2 gap-0.5">
                <span className="bg-primary/80 rounded-[2px]" />
                <span className="bg-primary/60 rounded-[2px]" />
                <span className="bg-primary/60 rounded-[2px]" />
                <span className="bg-primary/40 rounded-[2px]" />
              </span>
              GK Ice Cube
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <NavLink 
                to="/" 
                className={navLinkClass} 
                end
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Home
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100 group-[.active]:scale-x-100" />
              </NavLink>
              <NavLink 
                to="/order" 
                className={navLinkClass}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Order Now
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100 group-[.active]:scale-x-100" />
              </NavLink>
              <a href="/#contact" className={navLinkClass({isActive: false})}>
                Contact
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
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
