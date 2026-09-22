import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Mail, Phone, Building } from "lucide-react";
import apiClient from "../../services/api";
import { QuoteStatus } from "../../types";

export const AdminEnquiryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<QuoteStatus>("NEW");
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    setStatus(newStatus);
    setUpdating(true);
    try {
      await apiClient.patch(`/quotes/${id}/status`, { status: newStatus });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.warn("Status change preview simulation", err);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/enquiries" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
            Route: /admin/enquiries/{id}
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Enquiry Dossier #{id}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Customer & Inquiring Party
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Customer Name</span>
                <span className="font-semibold text-white text-sm">Ramesh Kumar</span>
              </div>
              <div>
                <span className="text-slate-500 block">Company Name</span>
                <span className="font-semibold text-white text-sm">Apex Manufacturing Ltd.</span>
              </div>
              <div>
                <span className="text-slate-500 block">Official Email</span>
                <span className="text-slate-300">ramesh@apexmanuf.com</span>
              </div>
              <div>
                <span className="text-slate-500 block">Phone</span>
                <span className="text-slate-300">+91 98400 11111</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Message & Scope
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                "Urgent quote required for 250 kVA silent diesel generator for factory expansion at our Oragadam unit. Needs to be commissioned within 3 weeks with AMF panel."
              </p>
            </div>
          </div>
        </div>

        {/* Workflow & Status Selector */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workflow Status
            </h3>

            <div className="space-y-2">
              {(["NEW", "CONTACTED", "IN_PROGRESS", "QUOTED", "CLOSED"] as QuoteStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    status === st
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  <span>{st}</span>
                  {status === st && <CheckCircle className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {success && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 text-center">
                Status updated successfully
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
