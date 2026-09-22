import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, Shield, Clock, ArrowRight } from "lucide-react";
import apiClient from "../services/api";
import { Service } from "../types";

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    apiClient
      .get<Service[]>("/services")
      .then((res) => setServices(res.data))
      .catch((err) => {
        console.warn("API not reachable yet; using Phase 0 services preview", err);
        setServices([
          {
            id: 1,
            title: "Annual Maintenance Contracts (AMC) & Preventive Care",
            slug: "amc-and-preventive-care",
            description:
              "Comprehensive periodic inspection, oil and filter replacements, electrical calibration, and guaranteed priority breakdown response.",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: "Turnkey Power Plant Installation & Commissioning",
            slug: "turnkey-installation-commissioning",
            description:
              "Complete civil foundation design, acoustic ventilation ducting, exhaust piping, synchronization panels, and regulatory approvals.",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 3,
            title: "Major Overhauling & Engine Rebuilding",
            slug: "major-overhauling-engine-rebuilding",
            description:
              "Precision workshop overhauling of diesel engines, alternator rewinding, turbocharger servicing, and dynamometer load testing.",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      <div className="max-w-3xl mb-12 space-y-4">
        <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
          Route Foundation: /services
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Engineering & Lifecycle Power Services
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          From preventative AMC maintenance to round-the-clock emergency support, Genesis Power Equipments delivers complete lifecycle care for industrial generator installations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.id} className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">{service.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{service.description}</p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/request-quote"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Inquire for AMC / Service
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
