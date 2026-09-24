import React from "react";
import { Product } from "../../types";
import { Badge } from "../common/Badge";
import { ShieldCheck } from "lucide-react";

export interface ProductSummaryProps {
  product: Product;
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({ product }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{product.category}</Badge>
        <Badge variant="outline" className="font-mono text-[11px]">
          Model: {product.slug}
        </Badge>
      </div>

      <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {product.name}
      </h1>

      {product.tagline && (
        <p className="text-base sm:text-lg text-sky-800 font-medium leading-relaxed">
          {product.tagline}
        </p>
      )}

      <p className="text-base text-slate-600 leading-relaxed pt-2">
        {product.description}
      </p>

      {/* Recommended Applications */}
      {product.applications && product.applications.length > 0 && (
        <div className="pt-4 space-y-3">
          <h2 className="font-heading text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            Recommended Applications &amp; Environments
          </h2>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
              {product.applications.map((app, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-600 flex-shrink-0" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSummary;
