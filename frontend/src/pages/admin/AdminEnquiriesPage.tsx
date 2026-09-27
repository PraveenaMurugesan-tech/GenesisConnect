import React, { useState } from "react";
import { Inbox, Clock, Layers, MessageSquare, FileCheck } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Card, CardContent } from "../../components/ui/Card";

export const AdminEnquiriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"quotes" | "custom" | "contact">("quotes");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200/60">
              <Inbox className="w-3.5 h-3.5 text-purple-600" />
              Customer Communications
            </span>
            <span className="text-xs text-slate-400 font-mono">/admin/enquiries</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Customer Enquiries &amp; Quotations Inbox
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track and process incoming requests for quotation, custom power requirements, and corporate messages.
          </p>
        </div>
      </div>

      {/* Phase 7 Roadmap Notice */}
      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-3 text-xs text-purple-900">
        <Clock className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Phase 7 Customer Enquiry Milestone:</span>{" "}
          Live customer quotation submissions, custom requirement processing, and automated staff email dispatches will be fully connected in Phase 7. The current Phase 6 scope covers Admin CMS, Product Catalogue, and Content Management.
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab("quotes")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "quotes"
              ? "border-purple-600 text-purple-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Quotation Requests</span>
          <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
            0
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "custom"
              ? "border-purple-600 text-purple-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Custom Requirements</span>
          <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
            0
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "contact"
              ? "border-purple-600 text-purple-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Direct Inquiries</span>
          <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
            0
          </span>
        </button>
      </div>

      {/* Clean Empty State */}
      <Card>
        <CardContent className="p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-heading text-base font-bold text-slate-900">
              No Enquiries in Database
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              There are currently no customer inquiries or quotation requests recorded. Incoming submissions from the public website will appear here in real time during Phase 7.
            </p>
          </div>
          <div className="pt-2">
            <Badge variant="outline" size="sm">
              Phase 7 Pipeline Ready
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEnquiriesPage;
