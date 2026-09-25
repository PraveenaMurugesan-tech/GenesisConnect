import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeader } from "../common/SectionHeader";
import { Button } from "../ui/Button";
import { ProductCard } from "../products/ProductCard";
import { fetchFeaturedProducts, getFeaturedProducts } from "../../services/productService";
import { Product } from "../../types";

export const FeaturedProductsSection: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(getFeaturedProducts());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetchFeaturedProducts()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setFeaturedProducts(data);
        }
      })
      .catch((err) => {
        console.warn("Featured products API fetch fell back to cached catalog:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <Container size="lg">
        {/* Section Header with View All action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            badge="Equipment Portfolio"
            title="Featured Power Protection Systems"
            subtitle="Engineered for high reliability across industrial manufacturing, healthcare facilities, and mission-critical installations."
            align="left"
            className="mb-0"
          />

          <Link to="/products" className="self-start md:self-auto flex-shrink-0">
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-white hover:bg-slate-50"
            >
              View Full Catalog (9 Products)
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        {isLoading && featuredProducts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
        )}

        {/* Bottom catalogue encouragement banner */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-industrial flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-heading text-base font-bold text-slate-900">
              Need custom voltage ratings, battery runtime, or specialized enclosures?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Genesis consults and builds custom engineering solutions to match exact project single-line diagrams.
            </p>
          </div>

          <Link to="/customized-requirement" className="flex-shrink-0">
            <Button variant="accent" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Submit Custom Specs
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProductsSection;
