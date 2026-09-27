import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit3,
  Eye,
  Trash2,
  Power,
  Search,
  RefreshCw,
  AlertCircle,
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
} from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { apiClient } from "../../services/api";
import { Product, PRODUCT_CATEGORIES } from "../../types";

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [togglingId, setTogglingId] = useState<string | number | null>(null);

  // Deletion modal state
  const [deleteProductTarget, setDeleteProductTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [hardDeleteOption, setHardDeleteOption] = useState<boolean>(false);

  // Toast / feedback message
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Product[]>("/admin/products");
      setProducts(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Your administrator session has expired. Please sign in again.");
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load product catalogue from the server. Ensure backend service is operational."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products locally for instantaneous UX
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const isActive = p.isActive ?? p.is_active;

      // Status filter
      if (selectedStatus === "Active" && !isActive) return false;
      if (selectedStatus === "Inactive" && isActive) return false;

      // Category filter
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;

      // Search keyword filter
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchSlug = p.slug.toLowerCase().includes(query);
        const matchCategory = p.category.toLowerCase().includes(query);
        const matchTagline = (p.tagline || "").toLowerCase().includes(query);
        const matchDesc = (p.description || "").toLowerCase().includes(query);
        return matchName || matchSlug || matchCategory || matchTagline || matchDesc;
      }

      return true;
    });
  }, [products, selectedCategory, selectedStatus, search]);

  // Toggle active/inactive status
  const handleToggleStatus = async (product: Product) => {
    const currentActive = product.isActive ?? product.is_active;
    const newStatus = !currentActive;
    setTogglingId(product.id);
    try {
      const response = await apiClient.patch<Product>(`/admin/products/${product.id}/status`, {
        is_active: newStatus,
      });
      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? response.data : item))
      );
      setFeedback({
        type: "success",
        text: `Product '${product.name}' is now ${newStatus ? "ACTIVE" : "INACTIVE"}.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.response?.data?.detail || "Failed to update product status.",
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setTogglingId(null);
    }
  };

  // Confirm delete or deactivation
  const handleConfirmDelete = async () => {
    if (!deleteProductTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/admin/products/${deleteProductTarget.id}`, {
        params: { hard_delete: hardDeleteOption },
      });

      if (hardDeleteOption) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteProductTarget.id));
        setFeedback({
          type: "success",
          text: `Product '${deleteProductTarget.name}' has been permanently deleted.`,
        });
      } else {
        // Soft delete (deactivated)
        setProducts((prev) =>
          prev.map((p) =>
            p.id === deleteProductTarget.id
              ? { ...p, is_active: false, isActive: false }
              : p
          )
        );
        setFeedback({
          type: "success",
          text: `Product '${deleteProductTarget.name}' has been deactivated.`,
        });
      }

      setDeleteProductTarget(null);
      setHardDeleteOption(false);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.response?.data?.detail || "Failed to process product deletion.",
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = useMemo(() => {
    return products.filter((p) => p.isActive ?? p.is_active).length;
  }, [products]);

  const inactiveCount = useMemo(() => {
    return products.filter((p) => !(p.isActive ?? p.is_active)).length;
  }, [products]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
              <Package className="w-3.5 h-3.5 text-amber-600" />
              Catalogue Control System
            </span>
            <span className="text-xs text-slate-400 font-mono">/admin/products</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Equipment Catalogue Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage official Genesis industrial power equipment, technical specifications, active statuses, and datasheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh product catalogue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link to="/admin/products/new">
            <Button variant="accent" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Live Feedback Alert */}
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

      {/* Global Error Alert */}
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
            onClick={fetchProducts}
            className="px-3 py-1 bg-rose-600 text-white rounded-md text-xs font-semibold hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metric Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Catalogue
          </span>
          <div className="mt-1 text-2xl font-extrabold text-slate-900">{products.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active / Visible
          </span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-600">{activeCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Inactive / Hidden
          </span>
          <div className="mt-1 text-2xl font-extrabold text-slate-500">{inactiveCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Showing Matches
          </span>
          <div className="mt-1 text-2xl font-extrabold text-sky-700">{filteredProducts.length}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by equipment name, category, slug, or specs..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown Filter */}
        <div className="sm:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="All">All Categories ({products.length})</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown Filter */}
        <div className="sm:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active ({activeCount})</option>
            <option value="Inactive">Inactive ({inactiveCount})</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-600">Loading equipment catalogue...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">No equipment found</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  {search || selectedCategory !== "All" || selectedStatus !== "All"
                    ? "No equipment listings match the applied filter criteria. Try clearing search filters or changing options."
                    : "No equipment records are currently stored in the catalogue database."}
                </p>
              </div>
              {(search || selectedCategory !== "All" || selectedStatus !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                    setSelectedStatus("All");
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Equipment Model</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Specifications</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isActive = p.isActive ?? p.is_active;
                  const specCount = Array.isArray(p.specifications)
                    ? p.specifications.length
                    : Object.keys(p.specifications || {}).length;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        !isActive ? "bg-slate-50/40 opacity-75" : ""
                      }`}
                    >
                      {/* Name & Slug */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          slug: {p.slug}
                        </div>
                        {p.tagline && (
                          <div className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                            {p.tagline}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-slate-700">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200/60">
                          {p.category}
                        </span>
                      </td>

                      {/* Specifications Summary */}
                      <td className="px-6 py-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>{specCount} parameters</span>
                        </div>
                        {p.datasheet && (
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-sky-700 font-medium">
                            <FileText className="w-3 h-3" />
                            <span>Datasheet linked</span>
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <Badge
                          variant={isActive ? "success" : "default"}
                          size="sm"
                          dot
                        >
                          {isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Quick Toggle Status */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(p)}
                            disabled={togglingId === p.id}
                            title={isActive ? "Deactivate (hide from public catalogue)" : "Activate (publish to catalogue)"}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isActive
                                ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                                : "text-slate-500 bg-slate-100 hover:bg-slate-200 border-slate-300"
                            } disabled:opacity-50`}
                          >
                            <Power
                              className={`w-3.5 h-3.5 ${
                                togglingId === p.id ? "animate-spin" : ""
                              }`}
                            />
                          </button>

                          {/* View on Public Site */}
                          <Link
                            to={`/products/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View public product page"
                          >
                            <button
                              type="button"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </Link>

                          {/* Edit Form */}
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            title="Edit equipment specifications"
                          >
                            <button
                              type="button"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-amber-800 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </Link>

                          {/* Delete Trigger */}
                          <button
                            type="button"
                            onClick={() => setDeleteProductTarget(p)}
                            title="Delete or deactivate equipment"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Accessible Confirmation Modal for Deletion / Deactivation */}
      {deleteProductTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 id="delete-dialog-title" className="font-heading text-lg font-bold text-slate-900">
                  Manage Product Removal
                </h3>
                <p className="text-xs text-slate-600">
                  Target: <span className="font-semibold text-slate-900">{deleteProductTarget.name}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You can soft-deactivate this product to immediately hide it from the public website while preserving all technical specifications, or permanently delete the database record.
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={hardDeleteOption}
                  onChange={(e) => setHardDeleteOption(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <span className="font-bold text-rose-700">Permanent Database Delete</span>
                  <p className="text-[11px] text-slate-500">
                    If checked, this product record will be permanently erased from PostgreSQL. Otherwise, it will be soft-deactivated.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteProductTarget(null);
                  setHardDeleteOption(false);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                leftIcon={isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              >
                {isDeleting
                  ? "Processing..."
                  : hardDeleteOption
                  ? "Permanently Delete"
                  : "Deactivate Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
