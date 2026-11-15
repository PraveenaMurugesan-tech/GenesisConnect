import React, { useState } from "react";
import { Product } from "../../types";
import { getProductImage } from "../../data/products";
import { Activity, Cpu, Sparkles, Zap, Shield } from "lucide-react";

export interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const primaryMappedImage = getProductImage(product);
  const imagesList = primaryMappedImage
    ? [primaryMappedImage]
    : product.images && product.images.length > 0 && !product.images[0].endsWith(".svg")
    ? product.images
    : product.image && !product.image.endsWith(".svg")
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
      return <Activity className="w-8 h-8 text-sky-400" aria-hidden="true" />;
    }
    if (slug.includes("stabilizer") || category.includes("stabilizer")) {
      return <Cpu className="w-8 h-8 text-amber-400" aria-hidden="true" />;
    }
    if (slug.includes("cvcf") || slug.includes("custom") || category.includes("power conditioning")) {
      return <Sparkles className="w-8 h-8 text-indigo-400" aria-hidden="true" />;
    }
    return <Zap className="w-8 h-8 text-amber-400" aria-hidden="true" />;
  };

  const activeImage = imagesList[activeIndex];
  const hasValidActiveImage = Boolean(activeImage && !imageErrors[activeIndex]);

  return (
    <div className="space-y-4">
      {hasValidActiveImage ? (
        /* Real Product Equipment Showcase (With Aspect Ratio Preservation) */
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-5 sm:p-6 border border-slate-800 text-white overflow-hidden shadow-xl">
          {/* Top Header Row */}
          <div className="relative z-10 flex items-center justify-between gap-4 pb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700/80">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              {product.category}
            </span>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-right font-mono text-xs">
              <span className="text-emerald-400 font-bold">Standard Industrial Duty</span>
            </div>
          </div>

          {/* Dedicated Photo Display Area */}
          <div className="relative w-full min-h-[260px] sm:min-h-[340px] max-h-[440px] flex items-center justify-center p-4 sm:p-6 overflow-hidden rounded-xl bg-slate-950/80 border border-slate-800/80 my-2">
            {/* Subtle grid backdrop */}
            <div
              className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"
              aria-hidden="true"
            />

            <img
              src={activeImage}
              alt={`${product.name} — Genesis Industrial Power Equipment`}
              onError={() => handleImageError(activeIndex)}
              className="max-h-[300px] sm:max-h-[380px] max-w-full object-contain rounded-lg drop-shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>

          {/* Footer Metadata Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow flex-shrink-0">
                {getProductIcon()}
              </div>
              <div>
                <span className="text-[11px] uppercase font-mono tracking-wider text-amber-400 font-semibold block">
                  Genesis Power Line
                </span>
                <span className="text-xs text-slate-400 block font-mono">
                  Model: {product.slug}
                </span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 font-mono hidden sm:block">
              <span className="block text-slate-300 font-semibold">100% Quality Inspected</span>
              <span>Direct OEM Engineering</span>
            </div>
          </div>
        </div>
      ) : (
        /* Neutral Technical Placeholder (Cath Lab UPS, Custom Systems, or Image Fallback) */
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-8 sm:p-10 border border-slate-800 text-white overflow-hidden shadow-xl min-h-[240px] flex flex-col justify-between">
          {/* Subtle grid backdrop */}
          <div
            className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700/80">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              {product.category}
            </span>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-right font-mono text-xs">
              <span className="text-amber-400 font-bold">Dedicated Engineering Spec</span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 py-6">
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
              <span className="block text-slate-300 font-semibold">Illustration Pending</span>
              <span>Direct OEM Engineering</span>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="text-slate-400">
              Verified OEM specifications detailed below
            </span>
            <span className="text-amber-400/90 font-medium hidden sm:inline">
              100% Quality Inspected
            </span>
          </div>
        </div>
      )}

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
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  onError={() => handleImageError(idx)}
                  className="w-full h-full object-contain bg-slate-900 p-1"
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
