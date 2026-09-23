import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Wrench,
  Activity,
  Gauge,
  Layers,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeader } from "../common/SectionHeader";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { getAllServices, DetailedService } from "../../data/services";

export const ServicesOverviewSection: React.FC = () => {
  const services = getAllServices();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-amber-500" />;
      case "Wrench":
        return <Wrench className="w-6 h-6 text-sky-600" />;
      case "Activity":
        return <Activity className="w-6 h-6 text-emerald-500" />;
      case "Gauge":
        return <Gauge className="w-6 h-6 text-indigo-500" />;
      default:
        return <Layers className="w-6 h-6 text-slate-700" />;
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <Container size="lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            badge="Engineering Support"
            title="Comprehensive Industrial Services"
            subtitle="Full-lifecycle engineering support: preventive maintenance agreements, harmonic power quality audits, and calibrated load bank commissioning."
            align="left"
            className="mb-0"
          />

          <Link to="/services" className="self-start md:self-auto flex-shrink-0">
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore All Services
            </Button>
          </Link>
        </div>

        {/* Services Grid (4 key services showcased) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.slice(0, 4).map((service: DetailedService) => (
            <Card key={service.id} hover className="flex flex-col justify-between h-full group">
              <CardContent className="p-6 sm:p-7 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  {getServiceIcon(service.icon)}
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {service.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {service.short_description}
                  </p>
                </div>

                {service.scope_points && service.scope_points.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    {service.scope_points.slice(0, 2).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <ChevronRight className="w-3.5 h-3.5 text-sky-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>

              <div className="p-6 pt-0">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 transition-colors"
                >
                  <span>Learn more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ServicesOverviewSection;
