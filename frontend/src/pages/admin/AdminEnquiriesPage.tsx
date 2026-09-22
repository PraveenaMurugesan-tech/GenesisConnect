import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Card, CardContent } from "../../components/ui/Card";

export const AdminEnquiriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"quotes" | "custom" | "contact">("quotes");

  const mockQuotes = [
    { id: 101, name: "S. Ramaswamy", company: "L&T Heavy Engineering", product: "500 kVA DG Set", status: "NEW", date: "Today" },
    { id: 102, name: "Anita Desai", company: "Apollo Health City", product: "1250 kVA Turnkey", status: "CONTACTED", date: "Yesterday" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent">Customer Communications</Badge>
            <span className="text-xs text-slate-500 font-mono">/admin/enquiries</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Customer Enquiries & Quotations Inbox
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track and process incoming requests for quotation, custom power requirements, and general messages.
          </p>
        </div>
      </div>

      {/* Phase 1 Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Phase 1 Inbox Shell:</span>
          {" "}Demonstrating tab switching, status badge rendering, and drill-down routing to detail views (`/admin/enquiries/:id`). Real database polling and automated notifications will be integrated in Phase 4.
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          type="button"
          onClick={() => setActiveTab("quotes")}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "quotes"
              ? "border-sky-600 text-sky-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Quotation Requests (2)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "custom"
              ? "border-sky-600 text-sky-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Custom Requirements (1)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "contact"
              ? "border-sky-600 text-sky-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Direct Messages (4)
        </button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Client / Company</th>
                <th className="px-6 py-4">Equipment Inquired</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Received</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{q.name}</div>
                    <div className="text-xs text-slate-500">{q.company}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">{q.product}</td>
                  <td className="px-6 py-4">
                    <Badge variant={q.status === "NEW" ? "accent" : "secondary"} size="sm">
                      {q.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{q.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/enquiries/${q.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEnquiriesPage;
