import React, { useState, useEffect } from "react";
import {
  Package,
  Inbox,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  FileEdit,
  Layers,
} from "lucide-react";
import { apiClient } from "../../services/api";
import { AdminDashboardStats } from "../../types";

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<AdminDashboardStats>("/admin/dashboard");
      setStats(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Your session has expired or is invalid. Please sign in again.");
      } else {
        setError("Unable to load live dashboard metrics. Please check backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Console Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              Administrative Console
            </span>
            <span className="text-xs text-slate-400 font-mono">Phase 5 Active</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {stats?.admin?.name || "Genesis Administrator"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System overview and operational controls for Genesis Power Equipments Pvt. Ltd.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchDashboardStats}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh dashboard metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-600" : ""}`} />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardStats}
            className="px-3 py-1 bg-rose-600 text-white rounded-md text-xs font-semibold hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Equipment in Catalog */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Equipment
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" />
            ) : (
              <div className="font-heading text-3xl font-extrabold text-slate-900">
                {stats?.total_products ?? 0}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Configured in database catalogue</span>
            </p>
          </div>
        </div>

        {/* Card 2: Active Products */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Catalogue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" />
            ) : (
              <div className="font-heading text-3xl font-extrabold text-emerald-700">
                {stats?.active_products ?? 0}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Publicly visible to prospective clients</span>
            </p>
          </div>
        </div>

        {/* Card 3: Enquiries (Phase 7 Roadmap) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer Enquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-heading text-lg font-bold text-slate-600">
              Not available
            </div>
            <p className="text-xs text-amber-700 font-semibold mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Scheduled for Phase 7</span>
            </p>
          </div>
        </div>

        {/* Card 4: System / Backend Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              System Engine
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-heading text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{stats?.system_status || "Operational"}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              FastAPI &bull; PostgreSQL &bull; JWT Auth
            </p>
          </div>
        </div>
      </div>

      {/* Architecture & Milestone Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phase 5 Active Card */}
        <div className="bg-white p-6 rounded-2xl border border-amber-300/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-bl-lg">
            Active Phase
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Phase 5 — Foundation</h2>
              <span className="text-xs text-emerald-600 font-semibold">Completed &amp; Protected</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Secure administrative authentication, token generation, protected dashboard APIs, and role-based route guards are active.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>JWT Bearer Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bcrypt Password Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected Dashboard Metrics</span>
            </div>
          </div>
        </div>

        {/* Phase 6 Roadmap Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Phase 6 — Admin CMS</h2>
              <span className="text-xs text-sky-700 font-semibold">Upcoming Milestone</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Administrative catalogue management, product creation, specification editing, image asset uploads, and datasheet downloads.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Equipment CRUD Management</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Cloud Media &amp; PDF Datasheets</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Services &amp; Homepage CMS</span>
            </div>
          </div>
        </div>

        {/* Phase 7 Roadmap Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Phase 7 — Enquiries</h2>
              <span className="text-xs text-purple-700 font-semibold">Upcoming Milestone</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Customer quote request lifecycle, custom requirement dispatch, status updates (New, Quoted, Closed), and contact inquiries.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Quotation Request Workflow</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Custom Requirements Review</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact Message Inbox</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
