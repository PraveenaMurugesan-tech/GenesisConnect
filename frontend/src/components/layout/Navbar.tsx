import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Zap,
  Menu,
  X,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Button } from "../ui/Button";

export interface NavItem {
  name: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Services", path: "/services" },
  { name: "Request a Quote", path: "/request-quote" },
  { name: "Customized Requirement", path: "/customized-requirement" },
  { name: "Contact Us", path: "/contact" },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      {/* Top Utility & Contact Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="tel:+914424980000"
              className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded px-1"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span>+91 (0) 44 2498 0000 / 24/7 Technical Support</span>
            </a>
            <a
              href="mailto:info@genesispower.in"
              className="hidden md:inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded px-1"
            >
              <Mail className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span>info@genesispower.in</span>
            </a>
          </div>

          {/* Compliance & Staff Portal */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              ISO 9001:2015 & CPCB-II Certified
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded px-1"
            >
              <Lock className="w-3 h-3 text-amber-500" aria-hidden="true" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Corporate Identity */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-lg p-1"
          >
            <div className="w-11 h-11 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 shadow-md group-hover:bg-slate-800 transition-colors">
              <Zap className="w-6 h-6 fill-amber-400 text-amber-400" aria-hidden="true" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                GENESIS<span className="text-amber-600 font-extrabold">CONNECT</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">
                Genesis Power Equipments Pvt. Ltd.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-1"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                aria-current={location.pathname === item.path ? "page" : undefined}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                    isActive
                      ? "text-sky-700 bg-sky-50 font-semibold"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action: Request Quote CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/request-quote">
              <Button
                variant="accent"
                size="md"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Request a Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link to="/request-quote" className="sm:hidden">
              <Button variant="accent" size="sm">
                Quote
              </Button>
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 transition-colors"
              aria-controls="mobile-nav"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-nav"
          className="xl:hidden fixed inset-x-0 top-[113px] sm:top-[116px] bottom-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="bg-white border-b border-slate-200 shadow-xl max-h-[calc(100vh-120px)] overflow-y-auto px-4 py-6 sm:px-6">
            <nav aria-label="Mobile Navigation" className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  aria-current={location.pathname === item.path ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "text-sky-700 bg-sky-50 font-semibold border-l-4 border-sky-600"
                        : "text-slate-800 hover:bg-slate-50"
                    }`
                  }
                >
                  <span>{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
              <Link
                to="/request-quote"
                onClick={() => setMobileMenuOpen(false)}
                className="block"
              >
                <Button variant="accent" size="lg" fullWidth>
                  Request a Custom Quote
                </Button>
              </Link>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-semibold text-slate-800">Direct Engineering Hotline:</div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>+91 (0) 44 2498 0000</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>info@genesispower.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
