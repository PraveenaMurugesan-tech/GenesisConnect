import React from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3, Eye, ShieldCheck } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export const AdminProductsPage: React.FC = () => {
  const mockProducts = [
    { id: 1, name: "Genesis Prime 500 kVA DG Set", category: "Diesel Generators", status: "Active", power: "500 kVA" },
    { id: 2, name: "Genesis Silent Acoustic 250 kVA", category: "Acoustic Enclosures", status: "Active", power: "250 kVA" },
    { id: 3, name: "Genesis Turnkey 1250 kVA Power Unit", category: "Turnkey Power Plants", status: "Draft", power: "1250 kVA" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent">Catalog Control</Badge>
            <span className="text-xs text-slate-500 font-mono">/admin/products</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Equipment Catalogue Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Maintain industrial generator listings, technical ratings, datasheets, and active statuses.
          </p>
        </div>

        <Link to="/admin/products/new">
          <Button variant="accent" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Product
          </Button>
        </Link>
      </div>

      {/* Phase 1 Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Phase 1 Route Structure:</span>
          {" "}This administrative catalog view demonstrates table layout, action triggers, and routing to edit forms. Live PostgreSQL mutations will be activated in Phase 4.
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Equipment Model</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{p.name}</td>
                  <td className="px-6 py-4 text-slate-600">{p.category}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{p.power}</td>
                  <td className="px-6 py-4">
                    <Badge variant={p.status === "Active" ? "success" : "default"} size="sm">
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link to={`/admin/products/${p.id}/edit`}>
                      <button className="p-1.5 rounded text-slate-500 hover:text-sky-600 hover:bg-slate-100">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link to={`/products/${p.id}`} target="_blank">
                      <button className="p-1.5 rounded text-slate-500 hover:text-sky-600 hover:bg-slate-100">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductsPage;
