// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — GenesisConnect
// Detailed Enquiry View & Status Workflow Manager
// ==============================================================================

import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Layers,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Save,
  Lock,
  Download,
} from "lucide-react";

import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { getEnquiryDocumentSignedUrl } from "../../services/storageService";
import {
  getAdminQuoteRequest,
  updateQuoteRequestStatus,
  getAdminCustomRequirement,
  updateCustomRequirementStatus,
  getAdminContactMessage,
  updateContactMessageStatus,
} from "../../services/enquiryService";
import {
  QuoteRequest,
  QuoteStatus,
  CustomRequirement,
  RequirementStatus,
  ContactMessage,
  ContactStatus,
} from "../../types";

export const AdminEnquiryDetailPage: React.FC = () => {
  const { type: rawType, id: rawId } = useParams<{ type?: string; id?: string }>();
  const id = Number(rawId);
  const enquiryType = rawType || "quotes";

  // Data states
  const [quoteData, setQuoteData] = useState<QuoteRequest | null>(null);
  const [customData, setCustomData] = useState<CustomRequirement | null>(null);
  const [contactData, setContactData] = useState<ContactMessage | null>(null);

  // Status editing state
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState<string | null>(null);

  // General UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchingDocUrl, setFetchingDocUrl] = useState(false);
  const [docDownloadError, setDocDownloadError] = useState<string | null>(null);

  const handleDownloadAttachment = async () => {
    if (!customData?.id) return;
    setFetchingDocUrl(true);
    setDocDownloadError(null);
    try {
      const res = await getEnquiryDocumentSignedUrl(customData.id);
      if (res.signed_url) {
        window.open(res.signed_url, "_blank", "noopener,noreferrer");
      } else {
        setDocDownloadError("Unable to retrieve signed download URL.");
      }
    } catch (err: any) {
      setDocDownloadError(
        err.response?.data?.detail || "Failed to generate temporary signed download URL."
      );
    } finally {
      setFetchingDocUrl(false);
    }
  };

  const fetchEnquiry = useCallback(async () => {
    if (!id || isNaN(id)) {
      setError("Invalid enquiry identifier.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (enquiryType === "quotes") {
        const res = await getAdminQuoteRequest(id);
        setQuoteData(res);
        setCurrentStatus(res.status);
      } else if (enquiryType === "custom") {
        const res = await getAdminCustomRequirement(id);
        setCustomData(res);
        setCurrentStatus(res.status);
      } else if (enquiryType === "contact") {
        const res = await getAdminContactMessage(id);
        setContactData(res);
        setCurrentStatus(res.status);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Enquiry record not found in the database.");
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please sign in again.");
      } else {
        setError("Unable to retrieve enquiry details from server.");
      }
    } finally {
      setLoading(false);
    }
  }, [id, enquiryType]);

  useEffect(() => {
    fetchEnquiry();
  }, [fetchEnquiry]);

  const handleStatusUpdate = async () => {
    if (!currentStatus) return;
    setIsUpdatingStatus(true);
    setStatusSuccessMsg(null);
    setError(null);

    try {
      if (enquiryType === "quotes") {
        const updated = await updateQuoteRequestStatus(id, currentStatus as QuoteStatus);
        setQuoteData(updated);
        setStatusSuccessMsg(`Quote status successfully updated to ${updated.status}`);
      } else if (enquiryType === "custom") {
        const updated = await updateCustomRequirementStatus(id, currentStatus as RequirementStatus);
        setCustomData(updated);
        setStatusSuccessMsg(`Custom requirement status updated to ${updated.status}`);
      } else if (enquiryType === "contact") {
        const updated = await updateContactMessageStatus(id, currentStatus as ContactStatus);
        setContactData(updated);
        setStatusSuccessMsg(`Message status updated to ${updated.status}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update enquiry status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
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

  const getStatusBadgeStyle = (status: string) => {
    const s = status.toUpperCase();
    if (s === "NEW" || s === "UNREAD") return "bg-amber-50 text-amber-800 border-amber-300";
    if (s === "CONTACTED" || s === "READ") return "bg-sky-50 text-sky-800 border-sky-300";
    if (s === "IN_PROGRESS" || s === "UNDER_REVIEW") return "bg-indigo-50 text-indigo-800 border-indigo-300";
    if (s === "QUOTED" || s === "REPLIED" || s === "ESTIMATED") return "bg-emerald-50 text-emerald-800 border-emerald-300";
    return "bg-slate-100 text-slate-700 border-slate-300";
  };

  const getPrefix = () => {
    if (enquiryType === "custom") return "GEN-REQ-";
    if (enquiryType === "contact") return "GEN-MSG-";
    return "GEN-QT-";
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading enquiry dossier #{id}...</p>
      </div>
    );
  }

  if (error && !quoteData && !customData && !contactData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to={`/admin/enquiries?tab=${enquiryType}`}>
          <button className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Enquiries Inbox</span>
          </button>
        </Link>
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-heading text-lg font-bold text-slate-900">Enquiry Unavailable</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
            <div className="pt-2">
              <Link to={`/admin/enquiries?tab=${enquiryType}`}>
                <Button variant="outline" size="sm">
                  Return to Inbox
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <Link to={`/admin/enquiries?tab=${enquiryType}`}>
            <button
              type="button"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return to inbox"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200/60 font-mono">
                {getPrefix()}
                {String(id).padStart(5, "0")}
              </span>
              <span className="text-xs text-slate-400 capitalize">
                {enquiryType === "quotes" ? "Quotation Request" : enquiryType === "custom" ? "Custom Requirement" : "Direct Message"}
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
              Customer Enquiry Dossier
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadgeStyle(
              currentStatus
            )}`}
          >
            Status: {currentStatus}
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {statusSuccessMsg && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{statusSuccessMsg}</span>
          </div>
          <button
            onClick={() => setStatusSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-600 hover:text-rose-800 font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Details & Workflow Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Technical Scope (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Customer Profile */}
          <Card className="shadow-xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-700" />
                  <span>Customer &amp; Organization Details</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Verified Lead</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[11px] block">Contact Representative</span>
                  <span className="font-semibold text-slate-900 text-sm mt-0.5 block">
                    {quoteData?.customer_name || customData?.customer_name || contactData?.name}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[11px] block">Company / Organization</span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                    {quoteData?.company_name || customData?.company_name || contactData?.company_name || "—"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Business Email
                  </span>
                  <a
                    href={`mailto:${quoteData?.email || customData?.email || contactData?.email}`}
                    className="font-medium text-sky-700 hover:underline text-xs mt-0.5 block font-mono"
                  >
                    {quoteData?.email || customData?.email || contactData?.email}
                  </a>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Contact Telephone
                  </span>
                  <a
                    href={`tel:${quoteData?.phone || customData?.phone || contactData?.phone}`}
                    className="font-medium text-slate-800 hover:underline text-xs mt-0.5 block font-mono"
                  >
                    {quoteData?.phone || customData?.phone || contactData?.phone || "—"}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Technical Scope / Quotation Scope */}
          {enquiryType === "quotes" && quoteData && (
            <Card className="shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-purple-700" />
                    <span>Commercial Equipment Selection</span>
                  </h3>
                  {quoteData.product && (
                    <Link
                      to={`/products/${quoteData.product.slug}`}
                      className="text-xs text-purple-700 hover:text-purple-800 font-medium inline-flex items-center gap-1"
                      target="_blank"
                    >
                      <span>Catalogue Specs</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                      <span className="text-slate-500 text-[11px] block">Requested Equipment Model</span>
                      <span className="font-bold text-purple-900 text-sm mt-0.5 block">
                        {quoteData.product_name || quoteData.product?.name || "Standard Power Line"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 text-[11px] block">Capacity Scope / Quantity</span>
                      <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                        {quoteData.quantity || "Calculated on site survey"}
                      </span>
                    </div>
                  </div>

                  {quoteData.requirement && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block mb-1">
                        Technical Scope &amp; Specifications
                      </span>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {quoteData.requirement}
                      </p>
                    </div>
                  )}

                  {quoteData.message && quoteData.message !== quoteData.requirement && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block mb-1">
                        Additional Customer Project Notes
                      </span>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {quoteData.message}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card 2: Custom Engineering Specifications */}
          {enquiryType === "custom" && customData && (
            <Card className="shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-700" />
                    <span>Technical Architecture Specifications</span>
                  </h3>
                  <span className="text-[11px] text-purple-700 font-semibold uppercase">R&amp;D Evaluation</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                      <span className="text-slate-500 text-[11px] block">Equipment Line</span>
                      <span className="font-bold text-purple-900 mt-0.5 block">
                        {customData.product || "Custom Power Setup"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                      <span className="text-slate-500 text-[11px] block">Capacity Rating</span>
                      <span className="font-bold text-purple-900 mt-0.5 block">
                        {customData.capacity || "Custom Load"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 text-[11px] block">Battery Specs</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {customData.battery_specifications || "Standard VRLA"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">Backup Autonomy Requirements</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {customData.backup_requirements || "Specified in project scope"}
                    </span>
                  </div>

                  {customData.equipment_information && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block mb-1">
                        Equipment &amp; Plant Load Profile
                      </span>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {customData.equipment_information}
                      </p>
                    </div>
                  )}

                  {customData.additional_requirements && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block mb-1">
                        Additional Environmental &amp; Bypass Requirements
                      </span>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {customData.additional_requirements}
                      </p>
                    </div>
                  )}

                  {customData.document_url && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs truncate max-w-xs sm:max-w-md">
                              {customData.document_name || "Technical_Requirement_Document.pdf"}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span>Encrypted Private Vault</span>
                              <span>&bull;</span>
                              <span className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]">
                                {customData.document_url}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleDownloadAttachment}
                          disabled={fetchingDocUrl}
                          className="flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{fetchingDocUrl ? "Generating Link..." : "Download / Inspect"}</span>
                        </Button>
                      </div>

                      {docDownloadError && (
                        <div className="p-2 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700">
                          {docDownloadError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card 2: Contact Message Content */}
          {enquiryType === "contact" && contactData && (
            <Card className="shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-700" />
                    <span>Inquiry Message Subject &amp; Body</span>
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[11px] block">Subject</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                      {contactData.subject || "General Inquire"}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block mb-2">
                      Message Content
                    </span>
                    <p className="text-slate-800 leading-relaxed text-sm whitespace-pre-wrap">
                      {contactData.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Workflow Lifecycle & Audit (1 col) */}
        <div className="space-y-6">
          {/* Card: Status Lifecycle Controller */}
          <Card className="shadow-xs border-purple-200/80">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Workflow Status</span>
                </h3>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Transition Enquiry State:
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {enquiryType === "contact" ? (
                    <>
                      <option value="UNREAD">UNREAD (New Submission)</option>
                      <option value="READ">READ (Under Assessment)</option>
                      <option value="REPLIED">REPLIED (Representative Assigned)</option>
                      <option value="CLOSED">CLOSED (Resolved)</option>
                      <option value="ARCHIVED">ARCHIVED (Archived)</option>
                    </>
                  ) : (
                    <>
                      <option value="NEW">NEW (Unprocessed)</option>
                      <option value="CONTACTED">CONTACTED (Client Reached)</option>
                      <option value="IN_PROGRESS">IN_PROGRESS (Proposal In Draft)</option>
                      <option value="QUOTED">QUOTED (Quotation Dispatched)</option>
                      <option value="CLOSED">CLOSED (Contract Finalized)</option>
                    </>
                  )}
                </select>

                <Button
                  variant="accent"
                  size="md"
                  onClick={handleStatusUpdate}
                  isLoading={isUpdatingStatus}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="w-full mt-2"
                >
                  Save Status Change
                </Button>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                Changes to status are authenticated, logged in PostgreSQL, and reflected immediately on administrative dashboards.
              </div>
            </CardContent>
          </Card>

          {/* Card: Audit & Timestamps */}
          <Card className="shadow-xs">
            <CardContent className="p-6 space-y-3 text-xs">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Audit Timeline
              </h4>

              <div className="flex items-start gap-2.5 text-slate-600">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 text-[11px] block">Record Submitted</span>
                  <span className="font-mono font-medium text-slate-900">
                    {formatDate(quoteData?.created_at || customData?.created_at || contactData?.created_at)}
                  </span>
                </div>
              </div>

              {(quoteData?.updated_at || customData?.updated_at || contactData?.updated_at) && (
                <div className="flex items-start gap-2.5 text-slate-600 pt-2 border-t border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Last Status Update</span>
                    <span className="font-mono font-medium text-slate-900">
                      {formatDate(quoteData?.updated_at || customData?.updated_at || contactData?.updated_at)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiryDetailPage;
