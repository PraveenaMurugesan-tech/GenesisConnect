import React from "react";
import { Building2, Award, Users, CheckCircle } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      <div className="max-w-3xl mb-12 space-y-4">
        <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
          Route Foundation: /about
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          About Genesis Power Equipments Pvt. Ltd.
        </h1>
        <p className="text-slate-400 leading-relaxed text-base">
          Genesis Power Equipments Pvt. Ltd. is a dedicated industrial power solutions company offering manufacturing, installation, commissioning, and maintenance of high-performance diesel generators, energy backup units, and switchgear systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <Building2 className="w-6 h-6 text-amber-500" />
          <h3 className="font-semibold text-white text-base">Company Infrastructure</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full-fledged testing facilities, load bank testing, acoustic chamber diagnostics, and turnkey installation capabilities across South India.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3">
          <Award className="w-6 h-6 text-amber-500" />
          <h3 className="font-semibold text-white text-base">Quality & Compliance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Adherence to ISO and CPCB emission standards, certified heavy-duty components, and stringent load testing before project sign-off.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3">
          <Users className="w-6 h-6 text-amber-500" />
          <h3 className="font-semibold text-white text-base">Engineering Team</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Certified technical engineers, rapid-response breakdown technicians, and dedicated account managers for corporate clients.
          </p>
        </div>
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="font-semibold text-white flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Phase 0 Foundation Status
        </div>
        <p>
          This route (/about) is successfully registered in the routing architecture. Full client content, leadership profiles, factory media, and timeline elements will be populated in Phase 1.
        </p>
      </div>
    </div>
  );
};
