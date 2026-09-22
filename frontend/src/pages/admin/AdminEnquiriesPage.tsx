import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Inbox, FileText, Mail, Eye, ChevronRight } from "lucide-react";
import apiClient from "../../services/api";
import { QuoteRequest, CustomRequirement, ContactMessage } from "../../types";

export const AdminEnquiriesPage: React.FC = () => {
  const [tab, setTab] = useState<"quotes" | "custom" | "contact">("quotes");

  const [quotes, setQuotes] = useState<QuoteRequest[]>([
    {
      id: 101,
      customer_name: "Ramesh Kumar",
      company_name: "Apex Manufacturing Ltd.",
      email: "ramesh@apexmanuf.com",
      phone: "+91 98400 11111",
      status: "NEW",
      message: "Urgent quote required for 250 kVA silent diesel generator for factory expansion.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 102,
      customer_name: "Dr. Ananya Rao",
      company_name: "City Care Hospitals",
      email: "ananya@citycare.org",
      phone: "+91 98400 22222",
      status: "CONTACTED",
      message: "Hospital standby power backup requirements with AMF synchronizer.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
          Route: /admin/enquiries
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Customer Enquiries & Quotations Console
        </h1>
        <p className="text-xs text-slate-400">
          Manage inbound quote submissions, technical custom requirements, and contact messages.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setTab("quotes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            tab === "quotes" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          Quote Requests (2)
        </button>
        <button
          onClick={() => setTab("custom")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            tab === "custom" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Custom Requirements (1)
        </button>
        <button
          onClick={() => setTab("contact")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            tab === "contact" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Contact Inquiries (3)
        </button>
      </div>

      {/* Content Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">ID</th>
              <th className="py-3.5 px-4 font-semibold">Customer / Company</th>
              <th className="py-3.5 px-4 font-semibold">Contact Info</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-slate-900/50">
                <td className="py-3.5 px-4 font-mono text-slate-400">#{q.id}</td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white">{q.customer_name}</div>
                  <div className="text-[11px] text-slate-400">{q.company_name}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  <div>{q.email}</div>
                  <div className="text-[10px] text-slate-400">{q.phone}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      q.status === "NEW" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {q.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/admin/enquiries/${q.id}`}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-400 font-medium"
                  >
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
