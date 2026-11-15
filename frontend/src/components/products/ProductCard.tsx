import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Zap, Shield, Cpu, Activity, Sparkles } from "lucide-react";
import { Product } from "../../types";
import { getProductImage } from "../../data/products";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/Card";
import { Badge } from "../common/Badge";
import { Button } from "../ui/Button";

export interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const [imageError, setImageError] = useState(false);

  // Select an appropriate technical icon based on category/slug
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
      return <Activity className="w-8 h-8 text-sky-500" aria-hidden="true" />;
    }
    if (slug.includes("stabilizer") || category.includes("stabilizer")) {
      return <Cpu className="w-8 h-8 text-amber-500" aria-hidden="true" />;
    }
    if (slug.includes("cvcf") || slug.includes("custom") || category.includes("power conditioning")) {
      return <Sparkles className="w-8 h-8 text-indigo-400" aria-hidden="true" />;
    }
    return <Zap className="w-8 h-8 text-amber-400" aria-hidden="true" />;
  };

  const primaryImage = getProductImage(product);
  const showImage = Boolean(primaryImage && !imageError);

  const displayShortDescription =
    product.shortDescription || product.short_description || product.description;

  const highlights = product.keyHighlights || product.key_highlights || (product.features ? product.features.slice(0, 3) : []);

  return (
    <Card hover className="flex flex-col justify-between h-full group border-slate-200/90 transition-all duration-200 overflow-hidden">
      <div>
        {/* Technical Product Header Visual */}
        {showImage ? (
          <div className="relative h-48 bg-slate-950 rounded-t-xl overflow-hidden border-b border-slate-800 flex items-center justify-center">
            {/* Subtle industrial grid backdrop */}
            <div
              className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
              aria-hidden="true"
            />

            {/* Product Photography - Aspect Ratio Preserved */}
            <div className="w-full h-full flex items-center justify-center p-3 relative z-0">
              <img
                src={primaryImage}
                alt={`${product.name} — Genesis Industrial Power Equipment`}
                onError={() => setImageError(true)}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
              />
            </div>

            {/* Gradient Overlays for High Badge Contrast */}
            <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-slate-950/85 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950/85 to-transparent pointer-events-none z-10" />

            {/* Top Badge Bar */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/90 backdrop-blur-sm text-slate-200 border border-slate-700/80 shadow pointer-events-auto">
                <Shield className="w-3 h-3 text-amber-400" />
                {product.category}
              </span>

              {featured && (
                <Badge variant="accent" size="sm" className="font-semibold shadow pointer-events-auto">
                  Featured
                </Badge>
              )}
            </div>

            {/* Bottom Reference Pill */}
            <div className="absolute bottom-2 right-3 z-20 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 backdrop-blur-sm text-slate-300 border border-slate-700/80 shadow pointer-events-auto">
                <span className="text-slate-400 uppercase">Genesis</span>
                <span className="text-amber-400 font-semibold">{product.slug.split("-")[0].toUpperCase()}</span>
              </span>
            </div>
          </div>
        ) : (
          /* Neutral Technical Placeholder (Cath Lab UPS, Custom Systems, or Image Fallback) */
          <div className="relative h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-t-xl p-5 flex flex-col justify-between overflow-hidden border-b border-slate-800">
            {/* Subtle industrial grid */}
            <div
              className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
              aria-hidden="true"
            />

            <div className="flex items-center justify-between relative z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800/90 text-slate-200 border border-slate-700/80">
                <Shield className="w-3 h-3 text-amber-400" />
                {product.category}
              </span>

              {featured && (
                <Badge variant="accent" size="sm" className="font-semibold">
                  Featured
                </Badge>
              )}
            </div>

            <div className="flex items-end justify-between relative z-10">
              <div className="w-14 h-14 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                {getProductIcon()}
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-medium">
                  Genesis Line
                </span>
                <span className="text-xs font-mono font-semibold text-amber-400">
                  {product.slug.split("-")[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Card Body */}
        <CardHeader className="pt-5 pb-3">
          <CardTitle className="text-lg leading-snug group-hover:text-sky-700 transition-colors">
            <Link
              to={`/products/${product.slug}`}
              className="hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-600 rounded"
            >
              {product.name}
            </Link>
          </CardTitle>
          {product.tagline && (
            <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">
              {product.tagline}
            </p>
          )}
          <CardDescription className="line-clamp-2 text-xs sm:text-sm text-slate-600 mt-2">
            {displayShortDescription}
          </CardDescription>
        </CardHeader>

        {/* Key Highlights / Features */}
        {highlights && highlights.length > 0 && (
          <CardContent className="pt-0 pb-4">
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              {highlights.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </div>

      {/* Card Actions */}
      <CardFooter className="flex-col sm:flex-row gap-2 pt-3">
        <Link to={`/products/${product.slug}`} className="w-full sm:w-1/2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            className="text-xs font-medium"
          >
            View Details
          </Button>
        </Link>
        <Link to={`/request-quote?product=${product.slug}`} className="w-full sm:w-1/2">
          <Button
            variant="accent"
            size="sm"
            fullWidth
            leftIcon={<Zap className="w-3.5 h-3.5" />}
            className="text-xs font-semibold"
          >
            Request Quote
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
