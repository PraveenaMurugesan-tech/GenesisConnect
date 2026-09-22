import React from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Activity,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

export const ServicesPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <Container size="lg">
        <SectionHeader
          badge="Engineering Services"
          title="Turnkey Industrial Maintenance & Engineering"
          subtitle="Comprehensive maintenance contracts, load bank diagnostic testing, emergency breakdown response, and plant overhaul services."
          className="mb-12"
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hover>
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Annual Maintenance Contracts (AMC)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Comprehensive and non-comprehensive AMC agreements with scheduled preventive service visits, fluid analysis, filter replacements, and priority 24/7 breakdown coverage.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Standard & Comprehensive Tiers</span>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                On-Site Load Bank Diagnostic Testing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mobile resistive and reactive load testing up to 2000 kVA to verify generator performance, prevent wet stacking, and ensure emergency backup reliability under full load.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Certified Test Reports Provided</span>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Emergency Breakdown Response
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Rapid-deployment field service engineers equipped with diagnostic equipment and genuine OEM spare parts to minimize unplanned industrial downtime.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Shield className="w-4 h-4 text-sky-600" />
                <span>24/7 Dedicated Support Desk</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phase 1 Routing Status */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-industrial flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Phase 1 Route Foundation</Badge>
              <span className="text-xs text-slate-500 font-mono">/services</span>
            </div>
            <h4 className="font-heading text-lg font-bold text-slate-900">
              Need to schedule a service inspection or AMC quote?
            </h4>
            <p className="text-sm text-slate-600 max-w-xl">
              In Phase 2, this section will include full service packages, AMC request forms, and service agreement calculator tools.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/contact">
              <Button variant="primary" size="md" leftIcon={<Headphones className="w-4 h-4" />}>
                Contact Service Desk
              </Button>
            </Link>
            <Link to="/request-quote">
              <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Request AMC Pricing
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ServicesPage;
