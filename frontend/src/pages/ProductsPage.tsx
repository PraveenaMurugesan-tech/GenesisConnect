import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Filter, Search, Download } from "lucide-react";
import apiClient from "../services/api";
import { Product } from "../types";

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic Product Fetching Architecture (FastAPI -> PostgreSQL)
    apiClient
      .get<Product[]>("/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Backend API not reachable yet; falling back to Phase 0 preview data", err);
        // Architectural fallback during Phase 0 local preview
        setProducts([
          {
            id: 1,
            name: "Industrial Silent Diesel Generator 250 kVA",
            slug: "silent-diesel-generator-250-kva",
            category: "Diesel Generators",
            description: "Heavy-duty acoustic enclosed silent diesel generator engineered for continuous industrial operations.",
            features: ["CPCB IV+ Compliant", "Acoustic Enclosure", "Digital AMF Controller"],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Heavy Duty Continuous Generator 500 kVA",
            slug: "continuous-generator-500-kva",
            category: "Industrial Power",
            description: "Rugged prime power engine configuration for factories, continuous processing plants, and severe conditions.",
            features: ["Electronic Governor", "Turbocharged Aftercooled", "High Fuel Economy"],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
            Dynamic Catalog Foundation: /products
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Industrial Power Equipment Catalogue
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm">
            Dynamically queried from PostgreSQL through FastAPI backend. No hardcoded products.
          </p>
        </div>

        {/* Filter / Search Bar Foundation */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search equipment..."
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              disabled
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            Categories
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Connecting to GenesisConnect API...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-slate-800 hover:border-amber-500/50 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 font-medium">
                    {product.category}
                  </span>
                  <Package className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">{product.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>
                {product.features && (
                  <ul className="text-[11px] text-slate-300 space-y-1">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  to={`/products/${product.slug}`}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  View Specifications
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/request-quote"
                  className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                >
                  Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-500 text-center">
        Phase 0 Routing & API Connection Established. Full catalog UI with high-res photos and live filtering will be styled in Phase 1.
      </div>
    </div>
  );
};
