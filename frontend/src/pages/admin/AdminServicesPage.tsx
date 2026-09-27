import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Plus,
  Edit3,
  Trash2,
  Power,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Sliders,
} from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { apiClient } from "../../services/api";
import { Service } from "../../types";

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Form modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formSlug, setFormSlug] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formImageUrl, setFormImageUrl] = useState<string>("");
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Deletion state
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Service[]>("/admin/services");
      setServices(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Unable to load services list. Please check backend connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openCreateModal = () => {
    setEditingService(null);
    setFormTitle("");
    setFormSlug("");
    setFormDescription("");
    setFormImageUrl("");
    setFormIsActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (svc: Service) => {
    setEditingService(svc);
    setFormTitle(svc.title || "");
    setFormSlug(svc.slug || "");
    setFormDescription(svc.description || "");
    setFormImageUrl(svc.image_url || "");
    setFormIsActive(svc.is_active);
    setFormError(null);
    setModalOpen(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim() || formTitle.trim().length < 2) {
      setFormError("Service title must be at least 2 characters.");
      return;
    }

    if (!formSlug.trim()) {
      setFormError("URL slug is required.");
      return;
    }

    const payload = {
      title: formTitle.trim(),
      slug: formSlug.trim().toLowerCase(),
      description: formDescription.trim() || null,
      image_url: formImageUrl.trim() || null,
      is_active: formIsActive,
    };

    setSaving(true);
    try {
      if (editingService) {
        const res = await apiClient.put<Service>(`/admin/services/${editingService.id}`, payload);
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? res.data : s))
        );
        setFeedback({
          type: "success",
          text: `Service '${formTitle}' updated successfully.`,
        });
      } else {
        const res = await apiClient.post<Service>("/admin/services", payload);
        setServices((prev) => [...prev, res.data]);
        setFeedback({
          type: "success",
          text: `Service '${formTitle}' created successfully.`,
        });
      }
      setModalOpen(false);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFormError(err.response?.data?.detail || "Failed to save service offering.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (svc: Service) => {
    setTogglingId(svc.id);
    try {
      const res = await apiClient.patch<Service>(`/admin/services/${svc.id}/status`, {
        is_active: !svc.is_active,
      });
      setServices((prev) =>
        prev.map((s) => (s.id === svc.id ? res.data : s))
      );
      setFeedback({
        type: "success",
        text: `Service '${svc.title}' is now ${res.data.is_active ? "ACTIVE" : "INACTIVE"}.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.response?.data?.detail || "Failed to update service status.",
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteService = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/admin/services/${deleteTarget.id}`);
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setFeedback({
        type: "success",
        text: `Service '${deleteTarget.title}' removed.`,
      });
      setDeleteTarget(null);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.response?.data?.detail || "Failed to delete service.",
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              Service Operations
            </span>
            <span className="text-xs text-slate-400 font-mono">/admin/services</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Engineering Services Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage official Genesis engineering services, preventive maintenance agreements, and public listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchServices}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh services list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <Button
            variant="accent"
            size="sm"
            onClick={openCreateModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Service
          </Button>
        </div>
      </div>

      {/* Feedback Toast */}
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
          <button
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-black/5 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchServices}
            className="px-3 py-1 bg-rose-600 text-white rounded-md text-xs font-semibold hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Services Table Card */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-600">Loading services data...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">No services registered</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  No engineering service offerings are currently stored in the database.
                </p>
              </div>
              <Button variant="accent" size="sm" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
                Register First Service
              </Button>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Service Offering</th>
                  <th className="px-6 py-4">Description Scope</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((svc) => (
                  <tr
                    key={svc.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      !svc.is_active ? "bg-slate-50/40 opacity-75" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{svc.title}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        slug: {svc.slug}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 max-w-md">
                      <p className="line-clamp-2">{svc.description || "No description provided."}</p>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={svc.is_active ? "success" : "default"} size="sm" dot>
                        {svc.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {/* Toggle Status */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(svc)}
                          disabled={togglingId === svc.id}
                          title={svc.is_active ? "Deactivate service" : "Activate service"}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            svc.is_active
                              ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                              : "text-slate-500 bg-slate-100 hover:bg-slate-200 border-slate-300"
                          } disabled:opacity-50`}
                        >
                          <Power className={`w-3.5 h-3.5 ${togglingId === svc.id ? "animate-spin" : ""}`} />
                        </button>

                        {/* View Public Route */}
                        <Link to="/services" target="_blank" rel="noopener noreferrer" title="View public services page">
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </Link>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(svc)}
                          title="Edit service details"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-800 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(svc)}
                          title="Delete service"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Service Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                {editingService ? "Edit Service Offering" : "Register Engineering Service"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (!editingService) {
                      setFormSlug(generateSlug(e.target.value));
                    }
                  }}
                  placeholder="e.g. Load Bank Testing & Commissioning"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    URL Slug <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormSlug(generateSlug(formTitle))}
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="load-bank-testing-commissioning"
                  className="w-full px-3.5 py-2 text-sm font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description Scope
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Technical scope, testing procedures, deliverables..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image URL / Asset Reference
                </label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="/images/services/load-testing.svg"
                  className="w-full px-3.5 py-2 text-sm font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="service-active"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="service-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Active (Display publicly on services page)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  type="submit"
                  disabled={saving}
                  leftIcon={saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : undefined}
                >
                  {saving ? "Saving..." : editingService ? "Update Service" : "Register Service"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden p-6 space-y-4">
            <h3 className="font-heading text-lg font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-slate-900">{deleteTarget.title}</span>?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteService}
                disabled={isDeleting}
                leftIcon={isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              >
                {isDeleting ? "Deleting..." : "Delete Service"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicesPage;
