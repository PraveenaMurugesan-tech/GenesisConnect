import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, ChevronRight, Filter } from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";

export interface MockProduct {
  id: number;
  name: string;
  slug: string;
  category: string;
  powerRating: string;
  engineBrand: string;
  phase: string;
  description: string;
}

const SAMPLE_PRODUCTS: MockProduct[] = [
  {
    id: 1,
    name: "Genesis Prime 500 kVA Heavy Industrial DG Set",
    slug: "genesis-prime-500kva-dg-set",
    category: "Diesel Generators",
    powerRating: "500 kVA / 400 kWe",
    engineBrand: "Heavy Duty Multi-Cylinder Turbocharged",
    phase: "3-Phase, 415V, 50 Hz",
    description: "Designed for continuous heavy manufacturing plants, hospitals, and critical data backup.",
  },
  {
    id: 2,
    name: "Genesis Silent Acoustic 250 kVA Generator",
    slug: "genesis-silent-acoustic-250kva-generator",
    category: "Acoustic Enclosures",
    powerRating: "250 kVA / 200 kWe",
    engineBrand: "Electronic Governor Industrial Diesel",
    phase: "3-Phase, 415V, 50 Hz",
    description: "Sound-attenuated weatherproof enclosure rated < 75 dBA at 1 meter per CPCB-II norms.",
  },
  {
    id: 3,
    name: "Genesis Turnkey 1250 kVA Power Unit",
    slug: "genesis-turnkey-1250kva-power-unit",
    category: "Turnkey Power Plants",
    powerRating: "1250 kVA / 1000 kWe",
    engineBrand: "Twin-Turbocharged Electronic Engine",
    phase: "3-Phase, 415V / 11kV HT Option",
    description: "High-capacity captive power station unit with auto-synchronization and load sharing panels.",
  },
];

const CATEGORIES = ["All Categories", "Diesel Generators", "Acoustic Enclosures", "Turnkey Power Plants", "Control Panels"];

export const ProductsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredProducts = selectedCategory === "All Categories"
    ? SAMPLE_PRODUCTS
    : SAMPLE_PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <Container size="lg">
        {/* Section Header */}
        <SectionHeader
          badge="Equipment Catalog"
          title="Industrial Power Generation Equipment"
          subtitle="Explore Genesis heavy-duty diesel generators, customized enclosures, and complete captive power plants."
          className="mb-8"
        />

        {/* Phase 1 Notice */}
        <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Phase 1 Routing & Layout Demo:</span>
            {" "}The catalogue architecture below demonstrates responsive product grid presentation and routes to dynamic product detail pages (`/products/:slug`). Full database-backed catalogue and filtering will be wired in Phase 2.
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                selectedCategory === category
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} hover className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" size="sm">{product.category}</Badge>
                    <span className="text-xs font-bold text-amber-600">{product.powerRating}</span>
                  </div>
                  <CardTitle className="text-base sm:text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-xs text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Output Rating:</span>
                    <span className="font-semibold text-slate-800">{product.powerRating}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Electrical Phase:</span>
                    <span className="font-semibold text-slate-800">{product.phase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Engine Class:</span>
                    <span className="font-semibold text-slate-800">{product.engineBrand}</span>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="flex-col sm:flex-row gap-2">
                <Link to={`/products/${product.slug}`} className="w-full sm:w-auto flex-1">
                  <Button variant="outline" size="sm" fullWidth rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    View Specs
                  </Button>
                </Link>
                <Link to="/request-quote" className="w-full sm:w-auto flex-1">
                  <Button variant="accent" size="sm" fullWidth leftIcon={<Zap className="w-3.5 h-3.5" />}>
                    Quote
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ProductsPage;
