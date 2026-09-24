import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, AlertCircle, Sliders } from "lucide-react";
import { Container } from "../components/common/Container";
import { Button } from "../components/ui/Button";
import { getProductBySlug } from "../services/productService";
import {
  ProductGallery,
  ProductSummary,
  ProductFeatures,
  ProductSpecifications,
  ProductDatasheet,
  ProductActions,
} from "../components/products";

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const product = getProductBySlug(slug);

  // Handle invalid product or missing slug state
  if (!product) {
    return (
      <div className="py-16 sm:py-24">
        <Container size="md">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-industrial space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Equipment Model Not Found
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                The product reference <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 text-xs">/products/{slug || "unknown"}</code> could not be located in the Genesis Power Equipments catalogue.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link to="/products">
                <Button variant="accent" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Equipment Catalog
                </Button>
              </Link>
              <Link to="/customized-requirement">
                <Button variant="outline" size="md" leftIcon={<Sliders className="w-4 h-4" />}>
                  Submit Custom Requirement
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-14 space-y-10">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/products" className="hover:text-slate-900 transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Product Overview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header, Title, Tagline & Applications */}
            <ProductSummary product={product} />

            {/* Technical Visual Representation Box & Gallery */}
            <ProductGallery product={product} />

            {/* Key Engineering Features */}
            <ProductFeatures features={product.features} productName={product.name} />

            {/* Technical Specifications */}
            <ProductSpecifications specifications={product.specifications} />

            {/* Datasheet Section */}
            <ProductDatasheet
              slug={product.slug}
              datasheet={product.datasheet || product.datasheet_url}
              productName={product.name}
            />

            {/* Back to Products Navigation Link */}
            <div className="pt-2">
              <Link to="/products">
                <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to All Products
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar Action Column */}
          <div className="lg:col-span-4 space-y-6">
            <ProductActions productSlug={product.slug} productName={product.name} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
