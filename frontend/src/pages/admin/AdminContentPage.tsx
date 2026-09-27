import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { apiClient } from "../../services/api";
import { HomepageContent, ContactInfo, Product, Service } from "../../types";

export const AdminContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"homepage" | "contact" | "announcements">("homepage");

  // Available products and services for selection
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

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
      const [hpRes, ctRes, prodRes, svcRes] = await Promise.allSettled([
        apiClient.get<HomepageContent>("/admin/content/homepage"),
        apiClient.get<ContactInfo>("/admin/content/contact"),
        apiClient.get<Product[]>("/admin/products"),
        apiClient.get<Service[]>("/admin/services"),
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
          onClick={() => setActiveTab("homepage")}
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
          onClick={() => setActiveTab("contact")}
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
          onClick={() => setActiveTab("announcements")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "announcements"
              ? "border-amber-600 text-amber-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Announcements & Banners</span>
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
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-600" />
                  Website Notification Banners
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish critical banners or maintenance announcements across the website.
                </p>
              </div>
            </div>

            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
              <Megaphone className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Announcement System</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active announcements are scheduled. You can publish notice alerts for factory visits, exhibitions, or holiday schedules.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminContentPage;
