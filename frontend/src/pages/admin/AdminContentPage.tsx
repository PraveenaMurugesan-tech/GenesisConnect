import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FileText,
  Phone,
  Megaphone,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Package,
  Wrench,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { apiClient } from "../../services/api";
import { HomepageContent, ContactInfo, Product, Service, Announcement } from "../../types";

interface AnnouncementFormState {
  title: string;
  content: string;
  link_url: string;
  link_text: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

const emptyAnnouncementForm: AnnouncementFormState = {
  title: "",
  content: "",
  link_url: "",
  link_text: "",
  is_active: true,
  start_date: "",
  end_date: "",
};

export interface AdminContentPageProps {
  defaultTab?: "homepage" | "contact" | "announcements";
}

export const AdminContentPage: React.FC<AdminContentPageProps> = ({ defaultTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get("tab") as "homepage" | "contact" | "announcements" | null;
  const [activeTab, setActiveTab] = useState<"homepage" | "contact" | "announcements">(
    queryTab || defaultTab || "homepage"
  );

  // Sync tab with URL query parameter
  const handleTabChange = (tab: "homepage" | "contact" | "announcements") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    if (queryTab && ["homepage", "contact", "announcements"].includes(queryTab)) {
      setActiveTab(queryTab);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [queryTab, defaultTab]);

  // Available products and services for selection
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  // Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<number | null>(null);
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementFormState>(emptyAnnouncementForm);
  const [announcementModalError, setAnnouncementModalError] = useState<string | null>(null);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(false);

  // Homepage CMS Form State
  const [homepageData, setHomepageData] = useState<HomepageContent>({
    hero_heading: "Engineered Power Resilience for Mission-Critical Infrastructure",
    hero_subheading:
      "Industrial UPS systems, servo stabilizers, and turnkey power conditioning engineered for healthcare and demanding manufacturing environments.",
    primary_cta_text: "Explore Equipment",
    primary_cta_link: "/products",
    secondary_cta_text: "Request a Quote",
    secondary_cta_link: "/request-quote",
    featured_product_slugs: [
      "industrial-ups",
      "ct-scanner-ups",
      "igbt-static-voltage-stabilizers",
      "servo-stabilizers",
    ],
    featured_service_slugs: [
      "annual-maintenance-contracts",
      "preventive-corrective-maintenance",
      "power-quality-audit",
      "load-bank-testing-commissioning",
    ],
  });

  // Contact Info State
  const [contactData, setContactData] = useState<ContactInfo>({
    company_name: "Genesis Power Equipments Pvt. Ltd.",
    brand_name: "Genesis Power Equipments",
    tagline: "Industrial Power Protection & Engineering Solutions",
    address_line1: "Industrial Estate, Guindy",
    city: "Chennai",
    state: "Tamil Nadu",
    postal_code: "600032",
    country: "India",
    phone_board: "+91 (0) 44 2498 0000",
    phone_hotline: "+91 98400 12345",
    email_general: "info@genesispower.in",
    email_sales: "sales@genesispower.in",
    email_support: "support@genesispower.in",
    office_hours: "Monday – Saturday: 8:30 AM – 6:30 PM",
    support_hours: "24/7 Breakdown & Emergency Support Coverage",
  });

  // Loading & Feedback
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [hpRes, ctRes, prodRes, svcRes, annRes] = await Promise.allSettled([
        apiClient.get<HomepageContent>("/admin/content/homepage"),
        apiClient.get<ContactInfo>("/admin/content/contact"),
        apiClient.get<Product[]>("/admin/products"),
        apiClient.get<Service[]>("/admin/services"),
        apiClient.get<Announcement[]>("/admin/announcements"),
      ]);

      if (hpRes.status === "fulfilled") {
        setHomepageData(hpRes.value.data);
      }
      if (ctRes.status === "fulfilled") {
        setContactData(ctRes.value.data);
      }
      if (prodRes.status === "fulfilled") {
        setAvailableProducts(prodRes.value.data);
      }
      if (svcRes.status === "fulfilled") {
        setAvailableServices(svcRes.value.data);
      }
      if (annRes.status === "fulfilled") {
        setAnnouncements(annRes.value.data);
      }
    } catch (err: any) {
      setError("Failed to load CMS content from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Save Homepage CMS
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await apiClient.put("/admin/content/homepage", homepageData);
      setFeedback({ type: "success", text: "Homepage content updated successfully." });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.response?.data?.detail || "Failed to update homepage content.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Save Contact Info
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await apiClient.put("/admin/content/contact", contactData);
      setFeedback({ type: "success", text: "Contact information updated successfully." });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.response?.data?.detail || "Failed to update contact info.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle Featured Product Selection
  const toggleFeaturedProduct = (slug: string) => {
    const current = homepageData.featured_product_slugs || [];
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    setHomepageData({ ...homepageData, featured_product_slugs: updated });
  };

  // Toggle Featured Service Selection
  const toggleFeaturedService = (slug: string) => {
    const current = homepageData.featured_service_slugs || [];
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    setHomepageData({ ...homepageData, featured_service_slugs: updated });
  };

  // Open Create Announcement Modal
  const handleOpenCreateAnnouncement = () => {
    setEditingAnnouncementId(null);
    setAnnouncementForm(emptyAnnouncementForm);
    setAnnouncementModalError(null);
    setIsAnnouncementModalOpen(true);
  };

  // Open Edit Announcement Modal
  const handleOpenEditAnnouncement = (ann: Announcement) => {
    setEditingAnnouncementId(ann.id);
    setAnnouncementForm({
      title: ann.title,
      content: ann.content,
      link_url: ann.link_url || "",
      link_text: ann.link_text || "",
      is_active: ann.is_active,
      start_date: ann.start_date ? ann.start_date.slice(0, 16) : "",
      end_date: ann.end_date ? ann.end_date.slice(0, 16) : "",
    });
    setAnnouncementModalError(null);
    setIsAnnouncementModalOpen(true);
  };

  // Save Announcement (Create or Update)
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (announcementForm.title.trim().length < 2) {
      setAnnouncementModalError("Announcement title must be at least 2 characters.");
      return;
    }
    if (announcementForm.content.trim().length < 5) {
      setAnnouncementModalError("Announcement content must be at least 5 characters.");
      return;
    }

    setSavingAnnouncement(true);
    setAnnouncementModalError(null);
    try {
      const payload = {
        title: announcementForm.title.trim(),
        content: announcementForm.content.trim(),
        link_url: announcementForm.link_url.trim() || null,
        link_text: announcementForm.link_text.trim() || null,
        is_active: announcementForm.is_active,
        start_date: announcementForm.start_date ? new Date(announcementForm.start_date).toISOString() : null,
        end_date: announcementForm.end_date ? new Date(announcementForm.end_date).toISOString() : null,
      };

      if (editingAnnouncementId) {
        const res = await apiClient.put<Announcement>(`/admin/announcements/${editingAnnouncementId}`, payload);
        setAnnouncements((prev) => prev.map((a) => (a.id === editingAnnouncementId ? res.data : a)));
        setFeedback({ type: "success", text: "Announcement updated successfully." });
      } else {
        const res = await apiClient.post<Announcement>("/admin/announcements", payload);
        setAnnouncements((prev) => [res.data, ...prev]);
        setFeedback({ type: "success", text: "New announcement published successfully." });
      }
      setTimeout(() => setFeedback(null), 4000);
      setIsAnnouncementModalOpen(false);
    } catch (err: any) {
      setAnnouncementModalError(err.response?.data?.detail || "Failed to save announcement.");
    } finally {
      setSavingAnnouncement(false);
    }
  };

  // Toggle Announcement Status
  const handleToggleAnnouncementStatus = async (id: number) => {
    try {
      const res = await apiClient.patch<Announcement>(`/admin/announcements/${id}/status`);
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? res.data : a)));
      setFeedback({
        type: "success",
        text: `Announcement status changed to ${res.data.is_active ? "Active" : "Inactive"}.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: "error", text: "Failed to toggle announcement status." });
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
    setDeletingAnnouncement(true);
    try {
      await apiClient.delete(`/admin/announcements/${announcementToDelete.id}`);
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementToDelete.id));
      setFeedback({ type: "success", text: "Announcement removed successfully." });
      setTimeout(() => setFeedback(null), 4000);
      setAnnouncementToDelete(null);
    } catch (err: any) {
      setFeedback({ type: "error", text: "Failed to delete announcement." });
    } finally {
      setDeletingAnnouncement(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Content Management Console
            </span>
            <span className="text-xs text-slate-400 font-mono">/admin/content</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Website Content & Information CMS
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage high-level business copy, homepage hero messaging, featured equipment, and verified contact details.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-600" : ""}`} />
          <span>Refresh CMS Data</span>
        </button>
      </div>

      {/* Live Feedback Toast */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between p-4 rounded-xl text-sm font-medium border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          type="button"
          onClick={() => handleTabChange("homepage")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "homepage"
              ? "border-amber-600 text-amber-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Homepage CMS</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("contact")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "contact"
              ? "border-amber-600 text-amber-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact Information</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("announcements")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "announcements"
              ? "border-amber-600 text-amber-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Announcements & Banners</span>
          {announcements.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-slate-200 text-slate-700">
              {announcements.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: HOMEPAGE CMS */}
      {activeTab === "homepage" && (
        <form onSubmit={handleSaveHomepage} className="space-y-6">
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-base font-bold text-slate-900">
                    Hero Section Messaging
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Main headline and descriptive copy prominently displayed on the public landing page.
                  </p>
                </div>
                <Link to="/" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1">
                  <span>Preview Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={homepageData.hero_heading}
                  onChange={(e) =>
                    setHomepageData({ ...homepageData, hero_heading: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hero Subheading Description
                </label>
                <textarea
                  rows={3}
                  value={homepageData.hero_subheading}
                  onChange={(e) =>
                    setHomepageData({ ...homepageData, hero_subheading: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={homepageData.primary_cta_text}
                    onChange={(e) =>
                      setHomepageData({ ...homepageData, primary_cta_text: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={homepageData.primary_cta_link}
                    onChange={(e) =>
                      setHomepageData({ ...homepageData, primary_cta_link: e.target.value })
                    }
                    placeholder="/products"
                    className="w-full mt-2 px-3.5 py-1.5 text-xs font-mono text-slate-600 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={homepageData.secondary_cta_text}
                    onChange={(e) =>
                      setHomepageData({ ...homepageData, secondary_cta_text: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={homepageData.secondary_cta_link}
                    onChange={(e) =>
                      setHomepageData({ ...homepageData, secondary_cta_link: e.target.value })
                    }
                    placeholder="/request-quote"
                    className="w-full mt-2 px-3.5 py-1.5 text-xs font-mono text-slate-600 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Products Selection */}
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  Featured Products Showcase
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select which equipment models appear in the curated homepage showcase section.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availableProducts.map((p) => {
                  const isSelected = homepageData.featured_product_slugs?.includes(p.slug);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleFeaturedProduct(p.slug)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? "bg-amber-50/70 border-amber-300 text-amber-900"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-xs text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{p.slug}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Featured Services Selection */}
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-600" />
                  Featured Engineering Services
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select which maintenance and engineering services appear in the homepage offerings section.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availableServices.map((svc) => {
                  const isSelected = homepageData.featured_service_slugs?.includes(svc.slug);
                  return (
                    <div
                      key={svc.id}
                      onClick={() => toggleFeaturedService(svc.slug)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? "bg-sky-50/70 border-sky-300 text-sky-900"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-xs text-slate-900">{svc.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{svc.slug}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="accent"
              size="md"
              disabled={saving}
              leftIcon={saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {saving ? "Saving Changes..." : "Save Homepage Content"}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: CONTACT INFORMATION */}
      {activeTab === "contact" && (
        <form onSubmit={handleSaveContact} className="space-y-6">
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-heading text-base font-bold text-slate-900">
                  Official Corporate Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified legal entity title and brand tagline.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Legal Enterprise Name
                  </label>
                  <input
                    type="text"
                    value={contactData.company_name}
                    onChange={(e) =>
                      setContactData({ ...contactData, company_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={contactData.brand_name}
                    onChange={(e) =>
                      setContactData({ ...contactData, brand_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tagline
                </label>
                <input
                  type="text"
                  value={contactData.tagline}
                  onChange={(e) =>
                    setContactData({ ...contactData, tagline: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Physical Address */}
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-heading text-base font-bold text-slate-900">
                  Headquarters &amp; Works Address
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified Genesis manufacturing and registered office address.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Address Line
                  </label>
                  <input
                    type="text"
                    value={contactData.address_line1}
                    onChange={(e) =>
                      setContactData({ ...contactData, address_line1: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={contactData.city}
                    onChange={(e) =>
                      setContactData({ ...contactData, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    State &amp; Postal Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={contactData.state}
                      onChange={(e) =>
                        setContactData({ ...contactData, state: e.target.value })
                      }
                      className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <input
                      type="text"
                      value={contactData.postal_code}
                      onChange={(e) =>
                        setContactData({ ...contactData, postal_code: e.target.value })
                      }
                      className="w-28 px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={contactData.country}
                    onChange={(e) =>
                      setContactData({ ...contactData, country: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phones & Support Hours */}
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-heading text-base font-bold text-slate-900">
                  Communications &amp; Availability
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official phones, emails, and operating hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Board Phone
                  </label>
                  <input
                    type="text"
                    value={contactData.phone_board}
                    onChange={(e) =>
                      setContactData({ ...contactData, phone_board: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Emergency Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={contactData.phone_hotline}
                    onChange={(e) =>
                      setContactData({ ...contactData, phone_hotline: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    General Email
                  </label>
                  <input
                    type="email"
                    value={contactData.email_general}
                    onChange={(e) =>
                      setContactData({ ...contactData, email_general: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sales Email
                  </label>
                  <input
                    type="email"
                    value={contactData.email_sales}
                    onChange={(e) =>
                      setContactData({ ...contactData, email_sales: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Office Hours
                  </label>
                  <input
                    type="text"
                    value={contactData.office_hours}
                    onChange={(e) =>
                      setContactData({ ...contactData, office_hours: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Support Coverage
                  </label>
                  <input
                    type="text"
                    value={contactData.support_hours}
                    onChange={(e) =>
                      setContactData({ ...contactData, support_hours: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="accent"
              size="md"
              disabled={saving}
              leftIcon={saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {saving ? "Saving Changes..." : "Save Contact Information"}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-600" />
                    Website Notification Banners &amp; Advisories
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Publish critical operational notices, maintenance advisories, and industry event banners across the public portal.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="accent"
                  size="sm"
                  onClick={handleOpenCreateAnnouncement}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  New Announcement
                </Button>
              </div>

              {announcements.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
                  <Megaphone className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">No Announcements Created</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Keep customers and corporate visitors informed with scheduled banners, factory holiday notices, or critical service advisories.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenCreateAnnouncement}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Create First Announcement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className={`p-5 rounded-xl border transition-all ${
                        ann.is_active
                          ? "bg-white border-slate-200 shadow-sm hover:border-amber-200"
                          : "bg-slate-50/70 border-slate-200 opacity-75"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                ann.is_active
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  ann.is_active ? "bg-emerald-500" : "bg-slate-400"
                                }`}
                              />
                              {ann.is_active ? "Active Banner" : "Inactive / Draft"}
                            </span>

                            {(ann.start_date || ann.end_date) && (
                              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {ann.start_date ? new Date(ann.start_date).toLocaleDateString() : "Immediate"}
                                {" → "}
                                {ann.end_date ? new Date(ann.end_date).toLocaleDateString() : "Indefinite"}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {ann.title}
                          </h3>

                          <p className="text-sm text-slate-600 whitespace-pre-line">
                            {ann.content}
                          </p>

                          {ann.link_url && (
                            <div className="pt-1">
                              <a
                                href={ann.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>{ann.link_text || ann.link_url}</span>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 sm:self-start shrink-0 pt-1">
                          <button
                            type="button"
                            onClick={() => handleToggleAnnouncementStatus(ann.id)}
                            title={ann.is_active ? "Deactivate banner" : "Activate banner"}
                            className={`p-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              ann.is_active
                                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            {ann.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditAnnouncement(ann)}
                            title="Edit announcement"
                            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setAnnouncementToDelete(ann)}
                            title="Delete announcement"
                            className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* CREATE / EDIT ANNOUNCEMENT MODAL */}
      {isAnnouncementModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150 my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-slate-900">
                {editingAnnouncementId ? "Edit Announcement" : "Create New Announcement"}
              </h2>
              <button
                type="button"
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="p-6 space-y-4">
              {announcementModalError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{announcementModalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={announcementForm.title}
                  onChange={(e) =>
                    setAnnouncementForm({ ...announcementForm, title: e.target.value })
                  }
                  placeholder="e.g. Scheduled Factory Maintenance — Guindy Plant"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message / Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={announcementForm.content}
                  onChange={(e) =>
                    setAnnouncementForm({ ...announcementForm, content: e.target.value })
                  }
                  placeholder="Detailed announcement text displayed on website banners..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Link URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={announcementForm.link_url}
                    onChange={(e) =>
                      setAnnouncementForm({ ...announcementForm, link_url: e.target.value })
                    }
                    placeholder="/contact or https://..."
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Link Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={announcementForm.link_text}
                    onChange={(e) =>
                      setAnnouncementForm({ ...announcementForm, link_text: e.target.value })
                    }
                    placeholder="e.g. Read Advisory"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Schedule (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={announcementForm.start_date}
                    onChange={(e) =>
                      setAnnouncementForm({ ...announcementForm, start_date: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    End Schedule (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={announcementForm.end_date}
                    onChange={(e) =>
                      setAnnouncementForm({ ...announcementForm, end_date: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={announcementForm.is_active}
                    onChange={(e) =>
                      setAnnouncementForm({ ...announcementForm, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span className="text-sm font-semibold text-slate-800">
                    Active (Publish banner to website immediately)
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  size="md"
                  disabled={savingAnnouncement}
                  leftIcon={
                    savingAnnouncement ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )
                  }
                >
                  {savingAnnouncement
                    ? "Saving..."
                    : editingAnnouncementId
                    ? "Save Changes"
                    : "Publish Announcement"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {announcementToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Delete Announcement?
                </h3>
                <p className="text-sm text-slate-600">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-slate-900">
                    "{announcementToDelete.title}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setAnnouncementToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="md"
                disabled={deletingAnnouncement}
                onClick={handleDeleteAnnouncement}
                leftIcon={
                  deletingAnnouncement ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )
                }
              >
                {deletingAnnouncement ? "Deleting..." : "Delete Announcement"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContentPage;

