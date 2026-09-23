import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Wrench,
  Activity,
  Gauge,
  Layers,
  ChevronRight,
  ArrowRight,
  Headphones,
  CheckCircle2,
  FileCheck,
  CalendarCheck,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { getAllServices, DetailedService } from "../data/services";

export const ServicesPage: React.FC = () => {
  const services = getAllServices();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="w-8 h-8 text-amber-500" />;
      case "Wrench":
        return <Wrench className="w-8 h-8 text-sky-600" />;
      case "Activity":
        return <Activity className="w-8 h-8 text-emerald-500" />;
      case "Gauge":
        return <Gauge className="w-8 h-8 text-indigo-500" />;
      default:
        return <Layers className="w-8 h-8 text-slate-700" />;
    }
  };

  return (
    <div className="py-10 sm:py-14 space-y-16">
      {/* 1. Page Header & Breadcrumbs */}
      <Container size="lg">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Services</span>
        </nav>

        <SectionHeader
          badge="Engineering Lifecycle"
          title="Industrial Power Engineering & Maintenance"
          subtitle="Comprehensive lifecycle support for power conditioning equipment, online UPS systems, and industrial voltage stabilizers across Tamil Nadu and South India."
          className="mb-0"
        />
      </Container>

      {/* 2. Detailed Service Cards Section */}
      <Container size="lg">
        <div className="space-y-10">
          {services.map((service: DetailedService) => (
            <Card key={service.id} className="overflow-hidden border-slate-200/90 shadow-industrial">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Header / Overview Banner */}
                <div className="lg:col-span-4 bg-slate-900 text-white p-7 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
                      {getServiceIcon(service.icon)}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
                        Genesis Engineering Service
                      </span>
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium pt-1">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      Target Deployment:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {service.ideal_for}
                    </p>
                  </div>
                </div>

                {/* Right Details: Scope & Deliverables */}
                <div className="lg:col-span-8 p-7 sm:p-9 space-y-6 bg-white">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Service Description
                    </h4>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                    {/* Scope of Work */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        Scope of Engineering Inspection
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                        {service.scope_points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-600 flex-shrink-0 mt-1.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Deliverables */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        Client Deliverables &amp; Records
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                        {service.deliverables.map((deliv, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0 mt-1.5" />
                            <span>{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs text-slate-500">
                      Executed by certified Genesis field engineers.
                    </span>

                    <div className="flex flex-wrap gap-3">
                      <Link to={`/request-quote?service=${service.slug}`}>
                        <Button
                          variant="accent"
                          size="sm"
                          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                          className="font-semibold text-xs"
                        >
                          Request Service Quotation
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button variant="outline" size="sm" className="text-xs">
                          Inquire Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      {/* 3. Service Methodology Workflow */}
      <section className="bg-slate-900 text-white py-16 border-y border-slate-800">
        <Container size="lg">
          <SectionHeader
            badge="Engineering Process"
            title="Our Service Delivery Methodology"
            subtitle="How Genesis approaches technical inspections, emergency breakdown restoration, and scheduled maintenance."
            align="center"
            className="mb-14 [&_h2]:text-white [&_p]:text-slate-300"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono font-bold text-sm">
                01
              </div>
              <h4 className="font-heading text-base font-bold text-white">
                Site &amp; Load Assessment
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Initial evaluation of electrical single line diagrams, load profile charts, harmonic distortion levels, and physical installation room environment.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
                02
              </div>
              <h4 className="font-heading text-base font-bold text-white">
                Technical Sizing &amp; Proposal
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Formulating transparent technical proposals detailing scope of work, frequency of preventive visits, SLA response windows, and spare parts inclusions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                03
              </div>
              <h4 className="font-heading text-base font-bold text-white">
                Scheduled Maintenance Execution
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Disciplined execution of quarterly health checks, infrared thermography, battery discharge profiling, and mechanical connection torquing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
                04
              </div>
              <h4 className="font-heading text-base font-bold text-white">
                Emergency Hotline &amp; Spares
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rapid emergency dispatch of factory-trained field engineers and genuine OEM replacement components to minimize unscheduled downtime.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Contact & Inquiry Call to Action */}
      <Container size="lg">
        <div className="rounded-2xl bg-white border border-slate-200 p-8 sm:p-12 shadow-industrial flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
              <CalendarCheck className="w-4 h-4" />
              <span>Service Consultation</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Need to Schedule an Inspection or Request an AMC Agreement?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Our service coordinators and power quality engineers will review your equipment roster and structure a customized maintenance plan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/request-quote">
              <Button variant="accent" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Request AMC Pricing
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="md" leftIcon={<Headphones className="w-4 h-4" />}>
                Contact Service Desk
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ServicesPage;
