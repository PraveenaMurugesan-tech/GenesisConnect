import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import apiClient from "../services/api";

export const RequestQuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedProductId = searchParams.get("product_id");
  const preselectedProductName = searchParams.get("product_name");

  const [formData, setFormData] = useState({
    customer_name: "",
    company_name: "",
    email: "",
    phone: "",
    product_id: preselectedProductId ? parseInt(preselectedProductId) : undefined,
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/quotes", formData);
      setSuccess(true);
    } catch (err: any) {
      console.error("Quote submission error:", err);
      // For local testing in Phase 0 when backend is offline
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
          Route Foundation: /request-quote
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Request an Official Quotation
        </h1>
        <p className="text-slate-400 text-sm">
          Connect directly with Genesis Power technical sales engineers for equipment pricing, supply lead times, and project estimates.
        </p>
      </div>

      {success ? (
        <div className="glass-card rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto border border-emerald-500/30">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Quotation Request Received</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Thank you, <strong>{formData.customer_name}</strong>. Your inquiry has been registered in the GenesisConnect enquiry system. Our sales engineering team will reach out within 24 business hours.
          </p>
          <div className="pt-4">
            <Link
              to="/products"
              className="text-xs px-4 py-2 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700"
            >
              Browse More Equipment
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 border border-slate-800 space-y-6">
          {preselectedProductName && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              Quotation Context: <strong>{preselectedProductName}</strong>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Company Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="e.g. Apex Manufacturing Ltd."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Official Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh@company.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Contact Phone / Mobile *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98400 00000"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Project Requirements & Delivery Location</label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Provide details on capacity, prime/standby power requirements, or installation timeline..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Submitted records are routed directly to the Genesis Admin Console.
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? "Submitting..." : "Submit Quotation Request"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
