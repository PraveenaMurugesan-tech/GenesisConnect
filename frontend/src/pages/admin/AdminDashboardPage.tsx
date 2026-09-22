import React from "react";
import { Link } from "react-router-dom";
import { Package, Inbox, FileText, Wrench, Users, ArrowUpRight, Activity } from "lucide-react";

export const AdminDashboardPage: React.FC = () => {
  const kpis = [
    { title: "Total Catalog Products", count: "12", icon: Package, href: "/admin/products", change: "Active" },
    { title: "Pending Quotations", count: "5", icon: Inbox, href: "/admin/enquiries", change: "+2 today" },
    { title: "Custom Requirements", count: "3", icon: FileText, href: "/admin/enquiries", change: "Awaiting review" },
    { title: "Active Services", count: "4", icon: Wrench, href: "/admin/services", change: "Operational" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
          Route: /admin/dashboard
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          Genesis Operations Overview
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Real-time metrics for products, quotations, client custom requirements, and service inquiries.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{kpi.title}</span>
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{kpi.count}</div>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                <span className="text-emerald-400 font-medium">{kpi.change}</span>
                <Link to={kpi.href} className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5">
                  Manage <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture Notice */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
          <Activity className="w-4 h-4" />
          Phase 0 Admin Architecture Note
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The administrative routing foundation, state management architecture, and backend endpoints have been laid out. In Phase 1 and subsequent phases, live charts, lead management modals, PDF generators, and full CRUD workflows will be fully implemented.
        </p>
      </div>
    </div>
  );
};
