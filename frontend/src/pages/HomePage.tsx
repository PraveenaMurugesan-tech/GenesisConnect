import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Wrench,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 border-b border-slate-800 relative overflow-hidden">
        {/* Subtle industrial grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <Badge variant="accent" dot>
                  Phase 1: Frontend Foundation Active
                </Badge>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Industrial Power Systems & Turnkey Engineering
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Official web platform for <strong>Genesis Power Equipments Pvt. Ltd.</strong> Supplying heavy-duty diesel generators, acoustic enclosures, AMF panels, and industrial energy solutions.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/products">
                  <Button
                    variant="accent"
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Explore Equipment Catalog
                  </Button>
                </Link>
                <Link to="/request-quote">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white"
                  >
                    Request Quotation
                  </Button>
                </Link>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    GenesisConnect Architecture
                  </span>
                  <Badge variant="primary" size="sm">v1.0.0</Badge>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Genesis Design System</div>
                      <div className="text-slate-400">Centralized industrial palette, accessible typography, and modular UI components.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Full Routing Foundation</div>
                      <div className="text-slate-400">Configured public and admin routes, dynamic product detail slugging, and 404 handler.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    <Cpu className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Phase 2 Ready</div>
                      <div className="text-slate-400">Design foundation established; production catalog and customer flows to be connected in Phase 2.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

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
