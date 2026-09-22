import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload, Plus } from "lucide-react";
import apiClient from "../../services/api";

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Diesel Generators",
    description: "",
    image_url: "",
    datasheet_url: "",
    is_active: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      // In full implementation, fetch product details
      setFormData({
        name: "Industrial Silent Diesel Generator 250 kVA",
        slug: "silent-diesel-generator-250-kva",
        category: "Diesel Generators",
        description: "Heavy-duty acoustic enclosed silent diesel generator engineered for continuous industrial operations.",
        image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        datasheet_url: "https://example.com/datasheets/genesis-250kva.pdf",
        is_active: true,
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await apiClient.put(`/products/${id}`, formData);
      } else {
        await apiClient.post("/products", formData);
      }
      navigate("/admin/products");
    } catch (err) {
      console.warn("Product save simulated in Phase 0 preview", err);
      navigate("/admin/products");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
            {isEditing ? `Route: /admin/products/${id}/edit` : "Route: /admin/products/new"}
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            {isEditing ? "Edit Equipment Profile" : "Create New Equipment Item"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Industrial Silent Diesel Generator 500 kVA"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">URL Slug *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. silent-diesel-generator-500-kva"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Diesel Generators">Diesel Generators</option>
              <option value="Gas Generators">Gas Generators</option>
              <option value="Industrial Power">Industrial Power</option>
              <option value="UPS & Battery Banks">UPS & Battery Banks</option>
              <option value="Switchgear & AMF Panels">Switchgear & AMF Panels</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Status</label>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-slate-800 text-amber-500 focus:ring-amber-500 h-4 w-4 bg-slate-900"
              />
              <label htmlFor="is_active" className="text-xs text-slate-300">
                Visible on public catalog
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed equipment description and intended application environments..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-lg shadow-amber-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};
