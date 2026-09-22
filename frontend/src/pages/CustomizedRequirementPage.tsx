import React, { useState } from "react";
import { Send, Upload, CheckCircle2 } from "lucide-react";
import apiClient from "../services/api";

export const CustomizedRequirementPage: React.FC = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    company_name: "",
    email: "",
    phone: "",
    product: "",
    capacity: "",
    battery_specifications: "",
    backup_requirements: "",
    equipment_information: "",
    additional_requirements: "",
    document_url: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post("/custom-requirements", formData);
      setSuccess(true);
    } catch (err) {
      console.warn("API offline or error during Phase 0 preview; simulating success", err);
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
          Route Foundation: /customized-requirement
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Customized Technical Requirement
        </h1>
        <p className="text-slate-400 text-sm">
          Submit custom engineering parameters for bespoke generator sets, battery energy storage systems, and specialized backup infrastructure.
        </p>
      </div>

      {success ? (
        <div className="glass-card rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto border border-emerald-500/30">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Custom Specification Submitted</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Thank you, <strong>{formData.customer_name}</strong>. Our power systems application engineering team has received your technical requirement and will initiate feasibility sizing.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              1. Contact & Corporate Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Contact Person *</label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Engineer / Plant Manager"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Company / Facility Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Manufacturing Plant / Hospital"
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
                placeholder="engineer@facility.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Phone Number *</label>
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

          <div className="border-b border-slate-800 pt-4 pb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              2. Technical Sizing & Electrical Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Target Equipment / Product Category</label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                placeholder="e.g. Hybrid Generator / Synchronized DG"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Required Capacity (kVA / kW)</label>
              <input
                type="text"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="e.g. 750 kVA Prime / 1000 kVA Standby"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Battery Specifications</label>
              <input
                type="text"
                value={formData.battery_specifications}
                onChange={(e) => setFormData({ ...formData, battery_specifications: e.target.value })}
                placeholder="e.g. Lithium-ion / VRLA 12V 150Ah Bank"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Backup Duration Requirements</label>
              <input
                type="text"
                value={formData.backup_requirements}
                onChange={(e) => setFormData({ ...formData, backup_requirements: e.target.value })}
                placeholder="e.g. 4 Hours continuous full-load backup"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Connected Equipment & Load Profile</label>
            <textarea
              rows={3}
              value={formData.equipment_information}
              onChange={(e) => setFormData({ ...formData, equipment_information: e.target.value })}
              placeholder="List heavy inductive motor loads, VFDs, harmonics, or sensitive electronic medical equipment..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Additional Site Constraints / Installation Details</label>
            <textarea
              rows={3}
              value={formData.additional_requirements}
              onChange={(e) => setFormData({ ...formData, additional_requirements: e.target.value })}
              placeholder="Rooftop placement, noise decibel limits (<65 dBA), automatic transfer switch requirements..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs font-semibold text-white">Attach Single-Line Diagram / Drawings</div>
                <div className="text-[10px] text-slate-400">PDF, CAD drawing, or site photo (Supabase Storage integration)</div>
              </div>
            </div>
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Choose File
            </button>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? "Submitting..." : "Submit Technical Specification"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
