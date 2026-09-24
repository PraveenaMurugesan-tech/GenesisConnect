import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Filter,
  Search,
  Sliders,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ProductCard } from "../components/products/ProductCard";
import { getProducts } from "../services/productService";
import { PRODUCT_CATEGORIES } from "../types";

export const ProductsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryOptions = ["All Categories", ...PRODUCT_CATEGORIES];

  const allProducts = useMemo(() => getProducts(), []);

  // Filter products based on category and search query
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Categories" || product.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.short_description &&
          product.short_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.tagline && product.tagline.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory("All Categories");
    setSearchQuery("");
  };

  return (
    <div className="py-10 sm:py-14 space-y-12">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Products Catalog</span>
        </nav>

        {/* Section Header */}
        <SectionHeader
          badge="Equipment Catalogue"
          title="Industrial Power Equipment & Systems"
          subtitle="Explore the complete Genesis product portfolio engineered for manufacturing, medical imaging, data centers, and critical commercial facilities."
          className="mb-8"
        />

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-industrial space-y-5">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by model, technology, or application..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-all"
                aria-label="Search equipment catalog"
              />
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
              <span>
                Showing <strong>{filteredProducts.length}</strong> of {allProducts.length} products
              </span>
              {(selectedCategory !== "All Categories" || searchQuery !== "") && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-2">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>

            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                  selectedCategory === category
                    ? "bg-slate-900 text-white font-semibold shadow-sm"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching equipment found"
            description="Try selecting a different category or refining your search keywords."
            action={
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            }
          />
        )}

        {/* Bottom Customized Requirement & Quote CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Zap className="w-4 h-4" />
              <span>Custom Engineering Scope</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
              Require Non-Standard Voltage, Battery Runtime, or Dual Isolation?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Genesis consults on custom electrical single-line diagrams (SLD), bespoke enclosure dimensions, and multi-unit synchronization panels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/customized-requirement">
              <Button
                variant="accent"
                size="md"
                leftIcon={<Sliders className="w-4 h-4" />}
                className="font-semibold shadow-md"
              >
                Custom Requirement
              </Button>
            </Link>
            <Link to="/request-quote">
              <Button
                variant="outline"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white"
              >
                Request Quotation
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductsPage;
