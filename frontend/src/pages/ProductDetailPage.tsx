import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, Download, ChevronRight, FileText, ArrowLeft, CheckCircle } from "lucide-react";
import apiClient from "../services/api";
import { Product } from "../types";

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    apiClient
      .get<Product>(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Could not fetch product detail from API; using preview placeholder", err);
        setProduct({
          id: 1,
          name: "Industrial Silent Diesel Generator 250 kVA",
          slug: slug || "silent-diesel-generator-250-kva",
          category: "Diesel Generators",
          description:
            "Heavy-duty acoustic enclosed silent diesel generator engineered for continuous industrial manufacturing, hospitals, and critical infrastructure.",
          features: [
            "Acoustic weatherproof canopy with < 70 dBA at 1m",
            "Electronic speed governing with fast load acceptance",
            "Digital auto-start controller with AMF function",
            "High fuel efficiency Cummins/Perkins engine configuration",
          ],
          specifications: {
            "Prime Power Rating": "250 kVA / 200 kW",
            "Standby Power Rating": "275 kVA / 220 kW",
            "Voltage": "415 V, 3 Phase, 50 Hz",
            "Power Factor": "0.8 Lagging",
            "Fuel Tank Capacity": "450 Litres",
          },
          image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          datasheet_url: "https://example.com/datasheets/genesis-250kva.pdf",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-slate-500">Loading product specifications...</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-slate-400">Product not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-white">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-400 font-medium truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image & Media */}
        <div className="lg:col-span-5 space-y-6">
          <div className="aspect-video bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-16 h-16 text-slate-700" />
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs font-semibold text-white">Technical Datasheet (PDF)</div>
                <div className="text-[10px] text-slate-400">Engineering drawings & specs</div>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-amber-400 hover:bg-slate-700">
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        </div>

        {/* Right Column: Specifications & CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-white mt-3">{product.name}</h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">{product.description}</p>
          </div>

          {/* Key Features */}
          {product.features && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Key Features & Engineering Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications Table */}
          {product.specifications && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Technical Specifications
              </h3>
              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`flex justify-between p-3 ${
                      idx % 2 === 0 ? "bg-slate-900/50" : "bg-slate-900/90"
                    }`}
                  >
                    <span className="text-slate-400 font-medium">{key}</span>
                    <span className="text-white font-semibold">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quotation CTA */}
          <div className="pt-4 flex items-center gap-4">
            <Link
              to={`/request-quote?product_id=${product.id}&product_name=${encodeURIComponent(product.name)}`}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
            >
              Request Quote for this Model
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
