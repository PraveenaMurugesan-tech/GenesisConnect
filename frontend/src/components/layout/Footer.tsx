import React from "react";
import { Link } from "react-router-dom";
import { Zap, Phone, Mail, MapPin, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20" role="contentinfo">
      {/* Top Pre-Footer Callout */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                Need a Heavy-Duty Industrial Power Solution?
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Our certified engineers consult on generator sizing, load bank testing, and turnkey electrical installations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Request Quotation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/customized-requirement"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Custom Engineering
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 shadow-md">
                <Zap className="w-5 h-5 fill-amber-400 text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <span className="font-heading text-lg font-bold tracking-tight text-white block">
                  GENESIS<span className="text-amber-500">CONNECT</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Genesis Power Equipments Pvt. Ltd.
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Premier industrial equipment engineering company specializing in online double-conversion UPS systems, precision static and servo voltage stabilizers, CVCF converters, and dedicated lifecycle maintenance services across South India.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 p-2.5 rounded-lg border border-slate-800 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Engineered Power Protection &amp; Technical Consultation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-amber-400 transition-colors">Products Catalog</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition-colors">Engineering Services</Link>
              </li>
              <li>
                <Link to="/customized-requirement" className="hover:text-amber-400 transition-colors">Custom Requirement</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Equipment Solutions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Equipment Lines
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/products/industrial-ups" className="hover:text-amber-400 transition-colors">Industrial Online UPS</Link>
              </li>
              <li>
                <Link to="/products/ct-scanner-ups" className="hover:text-amber-400 transition-colors">Medical &amp; CT Scanner UPS</Link>
              </li>
              <li>
                <Link to="/products/igbt-static-voltage-stabilizers" className="hover:text-amber-400 transition-colors">IGBT Static Voltage Stabilizers</Link>
              </li>
              <li>
                <Link to="/products/servo-stabilizers" className="hover:text-amber-400 transition-colors">Servo Voltage Stabilizers</Link>
              </li>
              <li>
                <Link to="/products/cvcf-systems" className="hover:text-amber-400 transition-colors">CVCF Frequency Converters</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition-colors">Preventive Maintenance AMCs</Link>
              </li>
            </ul>
          </div>

          {/* Headquarters & Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Headquarters
            </h4>
            <address className="not-italic text-sm text-slate-400 space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Genesis Power Equipments Pvt. Ltd.<br />
                  Industrial Estate, Guindy,<br />
                  Chennai, Tamil Nadu, India
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
                <a href="tel:+914424980000" className="hover:text-white transition-colors">
                  +91 (0) 44 2498 0000
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
                <a href="mailto:info@genesispower.in" className="hover:text-white transition-colors">
                  info@genesispower.in
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>
            &copy; {currentYear} Genesis Power Equipments Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>GenesisConnect Enterprise Platform</span>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Staff Login</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
