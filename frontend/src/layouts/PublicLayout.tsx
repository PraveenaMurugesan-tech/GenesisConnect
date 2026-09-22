import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Zap, Menu, X, Phone, Mail, ChevronRight } from "lucide-react";

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "Custom Solutions", path: "/customized-requirement" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Notification / Contact Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-400 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              +91 (0) 44 2498 0000 / 24/7 Service Support
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              info@genesispower.in
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Industrial Power Solutions Provider</span>
            <Link to="/admin/login" className="text-slate-400 hover:text-amber-400 transition-colors ml-2">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block font-sans">
                GENESIS<span className="text-amber-500">CONNECT</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase block font-medium">
                Genesis Power Equipments Pvt. Ltd.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-amber-400 bg-slate-800/80"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/request-quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
            >
              Request Quote
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? "text-amber-400 bg-slate-800" : "text-slate-200 hover:bg-slate-800/60"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4">
              <Link
                to="/request-quote"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm"
              >
                Request a Quote
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-lg text-white">Genesis Power Equipments</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Industrial power generation, high-capacity diesel generators, customized turnkey power plants, and dedicated engineering maintenance services.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-amber-400">About Genesis</Link></li>
                <li><Link to="/products" className="hover:text-amber-400">Product Catalog</Link></li>
                <li><Link to="/services" className="hover:text-amber-400">Engineering Services</Link></li>
                <li><Link to="/customized-requirement" className="hover:text-amber-400">Custom Solutions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Enquiries</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/request-quote" className="hover:text-amber-400">Request Quotation</Link></li>
                <li><Link to="/contact" className="hover:text-amber-400">Contact Sales Team</Link></li>
                <li><Link to="/admin/login" className="hover:text-amber-400">Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Headquarters</h4>
              <address className="not-italic text-sm text-slate-400 space-y-1">
                <p>Genesis Power Equipments Pvt. Ltd.</p>
                <p>Industrial Estate, Chennai, India</p>
                <p className="mt-2 text-slate-300">Email: info@genesispower.in</p>
                <p className="text-slate-300">Phone: +91 (0) 44 2498 0000</p>
              </address>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Genesis Power Equipments Pvt. Ltd. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">GenesisConnect Platform v1.0.0 (Phase 0)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
