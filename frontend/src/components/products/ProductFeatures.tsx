import React from "react";
import { Zap, CheckCircle2 } from "lucide-react";

export interface ProductFeaturesProps {
  features?: string[];
  productName?: string;
}

export const ProductFeatures: React.FC<ProductFeaturesProps> = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-600" />
        Key Engineering Features
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-industrial flex items-start gap-3"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm text-slate-700 leading-snug">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeatures;
