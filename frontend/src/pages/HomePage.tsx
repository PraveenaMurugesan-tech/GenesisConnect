import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Wrench,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Card, CardContent } from "../components/ui/Card";
import { HeroSection } from "../components/home/HeroSection";
import { CompanyIntroSection } from "../components/home/CompanyIntroSection";
import { FeaturedProductsSection } from "../components/home/FeaturedProductsSection";

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0 pb-16">
      {/* Genesis Corporate Hero Section */}
      <HeroSection />

      {/* Company Introduction */}
      <CompanyIntroSection />

      {/* Featured Products Showcase */}
      <FeaturedProductsSection />




      {/* Core Competencies Preview */}
      <section>
        <Container size="lg">
          <SectionHeader
            badge="Engineering Excellence"
            title="Industrial Power Generation Solutions"
            subtitle="Engineered for high reliability in continuous industrial operation, critical hospitals, and data centers."
            align="center"
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover>
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  High-Capacity DG Sets
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Heavy-duty diesel generators ranging from 15 kVA to 3000 kVA with CPCB-II compliant emissions and sound-attenuated enclosures.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 pt-2"
                >
                  View Product Specs
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Custom Turnkey Plants
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tailored captive power plant design, automatic synchronization panels, exhaust ducting, and civil acoustic installations.
                </p>
                <Link
                  to="/customized-requirement"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 pt-2"
                >
                  Custom Requirements
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  24/7 Engineering AMCs
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Preventive maintenance contracts, load bank testing diagnostics, genuine spare parts, and emergency response crews.
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-2"
                >
                  Maintenance Services
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
