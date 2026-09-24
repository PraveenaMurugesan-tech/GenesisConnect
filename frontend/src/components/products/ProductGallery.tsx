import React, { useState } from "react";
import { Product } from "../../types";
import { Activity, Cpu, Sparkles, Zap, Shield } from "lucide-react";

export interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const imagesList = product.images && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const getProductIcon = () => {
    const slug = product.slug.toLowerCase();
    const category = product.category.toLowerCase();
    if (
      slug.includes("medical") ||
      slug.includes("ct-scanner") ||
      slug.includes("cath-lab") ||
      slug.includes("ultrasound") ||
      category.includes("medical")
    ) {
      return <Activity className="w-10 h-10 text-sky-500" aria-hidden="true" />;
    }
    if (slug.includes("stabilizer") || category.includes("stabilizer")) {
      return <Cpu className="w-10 h-10 text-amber-500" aria-hidden="true" />;
    }
    if (slug.includes("cvcf") || slug.includes("custom") || category.includes("power conditioning")) {
      return <Sparkles className="w-10 h-10 text-indigo-400" aria-hidden="true" />;
    }
    return <Zap className="w-10 h-10 text-amber-400" aria-hidden="true" />;
  };

  const activeImage = imagesList[activeIndex];
  const hasValidActiveImage = Boolean(activeImage && !imageErrors[activeIndex]);

  return (
    <div className="space-y-4">
      {/* Primary Display Box */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-8 sm:p-10 border border-slate-800 text-white overflow-hidden shadow-xl min-h-[220px] flex flex-col justify-between">
        {/* Subtle grid backdrop */}
        <div
          className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"
          aria-hidden="true"
        />

        {hasValidActiveImage && (
          <img
            src={activeImage}
            alt={`${product.name} visual preview`}
            onError={() => handleImageError(activeIndex)}
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          />
        )}

        <div className="relative z-10 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700/80">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            {product.category}
          </span>
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-right font-mono text-xs">
            <span className="text-emerald-400 font-bold">Standard Industrial Duty</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg flex-shrink-0">
              {getProductIcon()}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold block">
                Genesis Power Line
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                {product.name}
              </h3>
              <span className="text-xs text-slate-400 block font-mono">
                Model Reference: {product.slug}
              </span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 font-mono hidden sm:block">
            <span className="block text-slate-300 font-semibold">100% Quality Inspected</span>
            <span>Direct OEM Engineering</span>
          </div>
        </div>
      </div>

      {/* Multiple Images Thumbnail Strip (if multiple images exist) */}
      {imagesList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Product image gallery thumbnails">
          {imagesList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-label={`View image ${idx + 1} of ${imagesList.length}`}
              aria-selected={activeIndex === idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                activeIndex === idx
                  ? "border-sky-500 shadow-md ring-2 ring-sky-500/20"
                  : "border-slate-200 hover:border-slate-300 opacity-70"
              }`}
            >
              {!imageErrors[idx] ? (
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  onError={() => handleImageError(idx)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 text-[10px] font-mono">
                  View {idx + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
