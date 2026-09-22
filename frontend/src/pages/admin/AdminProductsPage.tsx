import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import apiClient from "../../services/api";
import { Product } from "../../types";

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiClient
      .get<Product[]>("/products", { params: { active_only: false } })
      .then((res) => setProducts(res.data))
      .catch(() => {
        setProducts([
          {
            id: 1,
            name: "Industrial Silent Diesel Generator 250 kVA",
            slug: "silent-diesel-generator-250-kva",
            category: "Diesel Generators",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Heavy Duty Continuous Generator 500 kVA",
            slug: "continuous-generator-500-kva",
            category: "Industrial Power",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
            Route: /admin/products
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Product Catalog Management</h1>
          <p className="text-xs text-slate-400">Add, edit, and organize equipment in the company catalog.</p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Equipment Name</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Slug</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50">
                  <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-500" />
                    {p.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{p.category}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{p.slug}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-400 font-medium"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
