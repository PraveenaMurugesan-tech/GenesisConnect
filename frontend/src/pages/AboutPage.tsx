import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Award,
  Users,
  ShieldCheck,
  ChevronRight,
  Gauge,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <Container size="lg">
        {/* Section Header */}
        <SectionHeader
          badge="Company Profile"
          title="About Genesis Power Equipments Pvt. Ltd."
          subtitle="Delivering reliable, high-output industrial power generation systems, acoustic engineering, and complete turnkey electrical installations."
          className="mb-12"
        />

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hover>
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Manufacturing & Testing Infrastructure
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Modern manufacturing facilities located in Chennai equipped with precision sheet metal fabrication, computerized load bank testing, acoustic diagnostics, and assembly bays.
              </p>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                ISO & Emission Compliance
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Operating under rigorous ISO 9001:2015 quality standards with strict adherence to Central Pollution Control Board (CPCB-II) emission and noise limits.
              </p>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Certified Engineering Team
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our in-house team of electrical and mechanical engineers possess decades of combined experience in project design, commissioning, and mission-critical power management.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Phase 1 Status Banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-industrial space-y-4">
          <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Route Foundation: /about</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            This route is successfully integrated into the GenesisConnect design system. Detailed corporate leadership profiles, company milestones, and client case studies will be connected during Phase 2.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link to="/products">
              <Button variant="primary" size="md" rightIcon={<ChevronRight className="w-4 h-4" />}>
                Explore Our Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="md" leftIcon={<Gauge className="w-4 h-4" />}>
                Contact Our Engineering Office
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
