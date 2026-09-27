import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  Image,
  Tag,
  Sliders,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { apiClient } from "../../services/api";
import { Product, PRODUCT_CATEGORIES, ProductCategory, ProductSpecification } from "../../types";

interface ProductFormProps {
  productId?: string | number;
}

export const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const navigate = useNavigate();
  const isEditing = Boolean(productId);

  // Form Fields
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [slugTouched, setSlugTouched] = useState<boolean>(false);
  const [category, setCategory] = useState<ProductCategory>("UPS");
  const [tagline, setTagline] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [datasheet, setDatasheet] = useState<string>("");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState<string>("");
  const [applications, setApplications] = useState<string[]>([]);
  const [newApplication, setNewApplication] = useState<string>("");
  const [keyHighlights, setKeyHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  // Specifications structured state
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([
    { label: "Capacity Range", value: "" },
    { label: "Topology", value: "" },
    { label: "Output Voltage", value: "" },
    { label: "Frequency", value: "50 Hz nominal" },
  ]);

  // UI state
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-generate slug from name if not manually modified
  const generateSlugFromName = (input: string): string => {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && !slugTouched) {
      setSlug(generateSlugFromName(val));
    }
  };

  // Fetch existing product data if editing
  useEffect(() => {
    if (!productId) return;

    const fetchProductData = async () => {
      setLoading(true);
      setServerError(null);
      try {
        const response = await apiClient.get<Product>(`/admin/products/${productId}`);
        const data = response.data;

        setName(data.name || "");
        setSlug(data.slug || "");
        setSlugTouched(true);
        setCategory((data.category as ProductCategory) || "UPS");
        setTagline(data.tagline || "");
        setShortDescription(data.shortDescription || data.short_description || "");
        setDescription(data.description || "");
        setImage(data.image || data.image_url || "");
        setImages(data.images || []);
        setDatasheet(data.datasheet || data.datasheet_url || "");
        setFeatures(data.features || []);
        setApplications(data.applications || []);
        setKeyHighlights(data.keyHighlights || data.key_highlights || []);
        setIsActive(data.isActive ?? data.is_active ?? true);

        // Normalize specifications
        if (Array.isArray(data.specifications) && data.specifications.length > 0) {
          setSpecifications(
            data.specifications.map((s: any) => ({
              label: s.label || "",
              value: s.value || "",
            }))
          );
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setServerError(`Product #${productId} not found in database.`);
        } else {
          setServerError(
            err.response?.data?.detail || "Unable to retrieve equipment details from server."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // Client Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = "Equipment name must be at least 2 characters.";
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slug.trim()) {
      errors.slug = "URL slug is required.";
    } else if (!slugRegex.test(slug.trim())) {
      errors.slug = "Slug must contain only lowercase letters, numbers, and hyphens (e.g., 'industrial-ups').";
    }

    if (!PRODUCT_CATEGORIES.includes(category)) {
      errors.category = "Please select a valid equipment category.";
    }

    if (!description.trim() || description.trim().length < 10) {
      errors.description = "Technical description must be at least 10 characters.";
    }

    // Validate specification rows
    const invalidSpec = specifications.some((s) => !s.label.trim() && s.value.trim());
    if (invalidSpec) {
      errors.specifications = "Specification parameters cannot have a value without a label.";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    // Filter out blank specification rows
    const cleanedSpecs = specifications.filter(
      (s) => s.label.trim() !== "" || s.value.trim() !== ""
    );

    const payload = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      category: category,
      tagline: tagline.trim() || null,
      short_description: shortDescription.trim() || null,
      description: description.trim(),
      image: image.trim() || null,
      images: images.filter((img) => img.trim() !== ""),
      datasheet: datasheet.trim() || null,
      features: features.filter((f) => f.trim() !== ""),
      specifications: cleanedSpecs,
      applications: applications.filter((a) => a.trim() !== ""),
      key_highlights: keyHighlights.filter((k) => k.trim() !== ""),
      is_active: isActive,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await apiClient.put(`/admin/products/${productId}`, payload);
        setSuccessMessage("Product specifications updated successfully.");
      } else {
        await apiClient.post("/admin/products", payload);
        setSuccessMessage("New equipment registered successfully.");
      }

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 422) {
        const detail = err.response.data?.detail;
        if (typeof detail === "string") {
          setServerError(detail);
        } else if (Array.isArray(detail)) {
          // Pydantic validation error array
          const messages = detail.map((d: any) => `${d.loc?.join(".") || "field"}: ${d.msg}`).join(", ");
          setServerError(messages);
        } else {
          setServerError("Validation failed. Please verify input fields.");
        }
      } else {
        setServerError("Failed to save product. Please check server connectivity.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Specification Row Helpers
  const addSpecificationRow = () => {
    setSpecifications([...specifications, { label: "", value: "" }]);
  };

  const updateSpecificationRow = (index: number, field: "label" | "value", val: string) => {
    const updated = [...specifications];
    updated[index][field] = val;
    setSpecifications(updated);
  };

  const removeSpecificationRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Dynamic Array Helpers (Features, Applications, Highlights)
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const addApplication = () => {
    if (newApplication.trim()) {
      setApplications([...applications, newApplication.trim()]);
      setNewApplication("");
    }
  };

  const removeApplication = (idx: number) => {
    setApplications(applications.filter((_, i) => i !== idx));
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setKeyHighlights([...keyHighlights, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  const removeHighlight = (idx: number) => {
    setKeyHighlights(keyHighlights.filter((_, i) => i !== idx));
  };

  const addImageReference = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImageReference = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-600">Retrieving equipment records...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Return to equipment list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                {isEditing ? `Edit ID #${productId}` : "New Equipment Spec"}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {isEditing ? `/admin/products/${productId}/edit` : "/admin/products/new"}
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Edit: ${name || "Equipment Model"}` : "Register New Equipment Model"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products">
            <Button variant="ghost" size="sm" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="accent"
            size="sm"
            disabled={submitting}
            leftIcon={submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {submitting ? "Saving..." : isEditing ? "Update Specifications" : "Register Product"}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Submission Error: </span>
            <span>{serverError}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Section 1: Core Identification */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              General Equipment Information
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify model name, public URL slug, category, and catalogue visibility status.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label htmlFor="product-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Model Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Industrial UPS"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  clientErrors.name
                    ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/30"
                    : "border-slate-200 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                }`}
              />
              {clientErrors.name && (
                <p className="text-xs text-rose-600 mt-1">{clientErrors.name}</p>
              )}
            </div>

            {/* URL Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="product-slug" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSlug(generateSlugFromName(name));
                    setSlugTouched(true);
                  }}
                  className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  title="Generate URL slug from model name"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-generate</span>
                </button>
              </div>
              <input
                id="product-slug"
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="industrial-ups"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  clientErrors.slug
                    ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/30"
                    : "border-slate-200 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                }`}
              />
              {clientErrors.slug && (
                <p className="text-xs text-rose-600 mt-1">{clientErrors.slug}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div>
              <label htmlFor="product-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Equipment Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Status Switch */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Catalogue Visibility Status
              </label>
              <label className="relative inline-flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="text-sm font-semibold text-slate-700">
                  {isActive ? (
                    <span className="text-emerald-700">Active (Publicly visible in catalogue)</span>
                  ) : (
                    <span className="text-slate-500">Inactive (Draft / Hidden from public)</span>
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label htmlFor="product-tagline" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Marketing Tagline
            </label>
            <input
              id="product-tagline"
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Heavy-duty power protection for harsh manufacturing & continuous industrial operations"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="product-short-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Summary Description (Catalogue Cards)
            </label>
            <textarea
              id="product-short-desc"
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief 1-2 sentence overview for product listing cards..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Full Engineering Description */}
          <div>
            <label htmlFor="product-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Engineering Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="product-desc"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed technical operational breakdown, topology, electrical characteristics..."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                clientErrors.description
                  ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/30"
                  : "border-slate-200 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              }`}
            />
            {clientErrors.description && (
              <p className="text-xs text-rose-600 mt-1">{clientErrors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Structured Technical Specifications */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                Technical Specifications Table
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured parameter labels and engineering values (e.g. Capacity, Output Waveform, Topology).
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSpecificationRow}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Parameter Row
            </Button>
          </div>

          {clientErrors.specifications && (
            <p className="text-xs text-rose-600">{clientErrors.specifications}</p>
          )}

          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-1/3">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => updateSpecificationRow(index, "label", e.target.value)}
                    placeholder="Parameter (e.g. Output Voltage)"
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpecificationRow(index, "value", e.target.value)}
                    placeholder="Engineering Rating (e.g. 415V 3-Phase ±1%)"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSpecificationRow(index)}
                  title="Remove this parameter"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Media References & Datasheet */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <Image className="w-4 h-4 text-amber-600" />
              Media References & Datasheets
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify product imagery paths and downloadable technical PDF datasheet reference URLs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Primary Image */}
            <div>
              <label htmlFor="primary-image" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Product Image Path / URL
              </label>
              <input
                id="primary-image"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/products/industrial-ups.svg"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Datasheet Reference */}
            <div>
              <label htmlFor="datasheet-url" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Datasheet PDF Document URL
              </label>
              <input
                id="datasheet-url"
                type="text"
                value={datasheet}
                onChange={(e) => setDatasheet(e.target.value)}
                placeholder="/datasheets/industrial-ups-spec.pdf"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Gallery Images List */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Additional Gallery Image References
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="/images/products/gallery/alt-view-1.svg"
                className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addImageReference}>
                Add Image
              </Button>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {images.map((img, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700"
                  >
                    <span>{img}</span>
                    <button
                      type="button"
                      onClick={() => removeImageReference(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Features, Applications & Key Highlights */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              Features, Applications & Highlights
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured engineering highlights, target industry applications, and feature bullet points.
            </p>
          </div>

          {/* Key Highlights */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Key Engineering Highlights (Displayed on cards)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="e.g. Galvanic Isolation Protection"
                className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addHighlight}>
                Add Highlight
              </Button>
            </div>
            {keyHighlights.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {keyHighlights.map((k, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold"
                  >
                    <span>{k}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="text-amber-600 hover:text-rose-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Features Bullets */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Product Features & Topology Capabilities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g. True online double-conversion topology with pure sine wave output"
                className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addFeature}>
                Add Feature
              </Button>
            </div>
            {features.length > 0 && (
              <ul className="space-y-2 pt-1 text-xs text-slate-700">
                {features.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <span>&bull; {f}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="text-slate-400 hover:text-rose-600 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Target Applications */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Deployment & Industry Applications
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newApplication}
                onChange={(e) => setNewApplication(e.target.value)}
                placeholder="e.g. Hospital radiology and interventional suites"
                className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addApplication}>
                Add Application
              </Button>
            </div>
            {applications.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {applications.map((app, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200 text-sky-800 rounded-lg text-xs font-medium"
                  >
                    <span>{app}</span>
                    <button
                      type="button"
                      onClick={() => removeApplication(idx)}
                      className="text-sky-600 hover:text-rose-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Link to="/admin/products">
          <Button variant="ghost" size="md" type="button">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          variant="accent"
          size="md"
          disabled={submitting}
          leftIcon={submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        >
          {submitting ? "Saving Product..." : isEditing ? "Update Specifications" : "Register Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
