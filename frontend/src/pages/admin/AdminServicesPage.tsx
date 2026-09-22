import React, { useEffect, useState } from "react";
import { Wrench, Plus, Edit2 } from "lucide-react";
import apiClient from "../../services/api";
import { Service } from "../../types";

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      title: "Annual Maintenance Contracts (AMC) & Preventive Care",
      slug: "amc-and-preventive-care",
      description: "Periodic inspection, oil and filter replacements, and priority breakdown response.",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Turnkey Power Plant Installation & Commissioning",
      slug: "turnkey-installation-commissioning",
      description: "Foundation, ventilation ducting, exhaust piping, and synchronization panels.",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
            Route: /admin/services
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Services Management</h1>
          <p className="text-xs text-slate-400">Manage industrial maintenance, AMC, and engineering services.</p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-amber-500/20">
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                Active
              </span>
              <button className="text-slate-400 hover:text-amber-400">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <h3 className="font-bold text-white text-base">{s.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
            <div className="text-[10px] text-slate-500 font-mono pt-2">Slug: {s.slug}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
