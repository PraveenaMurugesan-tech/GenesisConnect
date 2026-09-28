// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — GenesisConnect
// Administrator Customer Enquiries & Quotations Management
// ==============================================================================

import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Inbox,
  FileCheck,
  Layers,
  MessageSquare,
  Search,
  RefreshCw,
  Eye,
  Filter,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent } from "../../components/ui/Card";
import {
  getAdminQuoteRequests,
  getAdminCustomRequirements,
  getAdminContactMessages,
} from "../../services/enquiryService";
import {
  QuoteRequest,
  CustomRequirement,
  ContactMessage,
} from "../../types";

type TabType = "quotes" | "custom" | "contact";

export const AdminEnquiriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "quotes";
  const [activeTab, setActiveTab] = useState<TabType>(
    ["quotes", "custom", "contact"].includes(initialTab) ? initialTab : "quotes"
  );

  // Data lists
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [customReqs, setCustomReqs] = useState<CustomRequirement[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync tab with URL
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setStatusFilter("");
    setSearchQuery("");
    setSearchParams({ tab });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "quotes") {
        const data = await getAdminQuoteRequests({
          status: statusFilter || undefined,
          search: searchQuery.trim() || undefined,
        });
        setQuotes(data);
      } else if (activeTab === "custom") {
        const data = await getAdminCustomRequirements({
          status: statusFilter || undefined,
          search: searchQuery.trim() || undefined,
        });
        setCustomReqs(data);
      } else if (activeTab === "contact") {
        const data = await getAdminContactMessages({
          status: statusFilter || undefined,
          search: searchQuery.trim() || undefined,
        });
        setContacts(data);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Your session has expired. Please sign in again.");
      } else {
        setError("Unable to load enquiries. Please verify backend database connectivity.");
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, statusFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "NEW" || s === "UNREAD") {
      return "bg-amber-50 text-amber-800 border-amber-200/80";
    }
    if (s === "CONTACTED" || s === "READ") {
      return "bg-sky-50 text-sky-800 border-sky-200/80";
    }
    if (s === "IN_PROGRESS" || s === "UNDER_REVIEW") {
      return "bg-indigo-50 text-indigo-800 border-indigo-200/80";
    }
    if (s === "QUOTED" || s === "REPLIED" || s === "ESTIMATED") {
      return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
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
            Review and track incoming quote requests, custom specifications, and direct messages in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh enquiry records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          type="button"
          onClick={() => handleTabChange("quotes")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "quotes"
              ? "border-purple-600 text-purple-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Quotation Requests</span>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
            {activeTab === "quotes" ? quotes.length : "•"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("custom")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "custom"
              ? "border-purple-600 text-purple-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Custom Requirements</span>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
            {activeTab === "custom" ? customReqs.length : "•"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("contact")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "contact"
              ? "border-purple-600 text-purple-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Direct Inquiries</span>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
            {activeTab === "contact" ? contacts.length : "•"}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "quotes"
                ? "Search by customer name, company, email..."
                : activeTab === "custom"
                ? "Search by company, capacity, requirements..."
                : "Search by sender name, company, subject..."
            }
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Statuses</option>
              {activeTab === "contact" ? (
                <>
                  <option value="UNREAD">Unread</option>
                  <option value="READ">Read</option>
                  <option value="REPLIED">Replied</option>
                  <option value="CLOSED">Closed</option>
                  <option value="ARCHIVED">Archived</option>
                </>
              ) : (
                <>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="QUOTED">Quoted</option>
                  <option value="CLOSED">Closed</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs shadow-xs"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-rose-600 text-white rounded-md text-xs font-semibold hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content Section: Quotes Tab */}
      {activeTab === "quotes" && (
        <>
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto mb-2" />
              <span>Loading quotation requests...</span>
            </div>
          ) : quotes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  {searchQuery || statusFilter ? "No Matching Quotation Requests" : "No Quotation Requests in Database"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || statusFilter
                    ? "Try clearing your filters or search keywords."
                    : "Incoming quotation requests submitted from the public website will appear here in real time."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Ref / Customer</th>
                      <th className="py-3.5 px-4">Organization</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Selected Equipment</th>
                      <th className="py-3.5 px-4">Submitted Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-purple-700 font-bold block">
                            GEN-QT-{String(q.id).padStart(5, "0")}
                          </span>
                          <span className="font-semibold text-slate-900 text-xs">{q.customer_name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {q.company_name || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-800 block">{q.email}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{q.phone}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-800 block">
                            {q.product_name || q.product?.name || "Power Solution"}
                          </span>
                          {q.quantity && (
                            <span className="text-slate-500 text-[11px] block">Capacity: {q.quantity}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {formatDate(q.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                              q.status
                            )}`}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/admin/enquiries/quotes/${q.id}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-purple-700 hover:text-purple-800 hover:bg-purple-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Content Section: Custom Requirements Tab */}
      {activeTab === "custom" && (
        <>
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto mb-2" />
              <span>Loading customized power requirements...</span>
            </div>
          ) : customReqs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  {searchQuery || statusFilter ? "No Matching Custom Requirements" : "No Custom Requirements in Database"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || statusFilter
                    ? "Try adjusting search terms or status filters."
                    : "Client engineering specifications and customized requests will be recorded here."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Ref / Representative</th>
                      <th className="py-3.5 px-4">Organization</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Scope &amp; Capacity</th>
                      <th className="py-3.5 px-4">Submitted Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customReqs.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-purple-700 font-bold block">
                            GEN-REQ-{String(r.id).padStart(5, "0")}
                          </span>
                          <span className="font-semibold text-slate-900 text-xs">{r.customer_name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {r.company_name || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-800 block">{r.email}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{r.phone}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-800 block">{r.product || "Custom Power Setup"}</span>
                          <span className="text-purple-700 font-semibold text-[11px] block">
                            Rating: {r.capacity || "As per plant spec"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {formatDate(r.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                              r.status
                            )}`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/admin/enquiries/custom/${r.id}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-purple-700 hover:text-purple-800 hover:bg-purple-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Content Section: Contact Messages Tab */}
      {activeTab === "contact" && (
        <>
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto mb-2" />
              <span>Loading contact messages...</span>
            </div>
          ) : contacts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  {searchQuery || statusFilter ? "No Matching Contact Messages" : "No Contact Messages in Database"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || statusFilter
                    ? "Try adjusting search terms or status filters."
                    : "Direct customer messages submitted through the contact page will appear here."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Ref / Sender</th>
                      <th className="py-3.5 px-4">Organization</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Subject</th>
                      <th className="py-3.5 px-4">Submitted Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contacts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-purple-700 font-bold block">
                            GEN-MSG-{String(c.id).padStart(5, "0")}
                          </span>
                          <span className="font-semibold text-slate-900 text-xs">{c.name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {c.company_name || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-800 block">{c.email}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{c.phone || "—"}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-800 block line-clamp-1">
                            {c.subject || "General Inquire"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {formatDate(c.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                              c.status
                            )}`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/admin/enquiries/contact/${c.id}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-purple-700 hover:text-purple-800 hover:bg-purple-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
