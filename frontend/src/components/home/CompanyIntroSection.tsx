import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Cpu, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeader } from "../common/SectionHeader";
import { Button } from "../ui/Button";

export const CompanyIntroSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeader
              badge="Engineering Excellence"
              title="Dedicated to Power Protection & Precision Voltage Engineering"
              subtitle="Genesis Power Equipments Pvt. Ltd. provides engineered solutions for environments where continuous electrical reliability is indispensable."
              align="left"
            />

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Modern industrial machinery, automated process plants, and sensitive medical imaging systems require power that is not merely uninterrupted, but completely free from voltage fluctuations, harmonic pollution, and transient surges.
              </p>
              <p>
                At Genesis Power Equipments, our engineering approach centers on understanding specific site electrical constraints and load dynamics. Rather than supplying generic electrical boxes, we configure online double-conversion UPS, solid-state IGBT stabilizers, and custom distribution panels to ensure unwavering protection and prolonged equipment service life.
              </p>
            </div>

            {/* Core Competencies Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 flex-shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-slate-900">
                    Application-Specific Sizing
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tailored for inductive motors, medical pulsed X-ray tubes, and continuous data systems.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-slate-900">
                    Rigorous Testing Standards
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Every system undergoes extensive multi-step functional and full-load validation.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/about">
                <Button
                  variant="outline"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-medium"
                >
                  Learn More About Genesis
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Industrial Trust & Capability Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-slate-900 text-white p-7 sm:p-8 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="space-y-2 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Zap className="w-4 h-4" />
                  <span>Engineering Mandate</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-white tracking-tight">
                  Protecting Critical Industrial &amp; Healthcare Operations
                </h3>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">Healthcare Continuity:</strong> Specializing in power conditioning for sensitive diagnostic imaging installations including CT scanners, Cath Labs, and ultrasound units.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">Manufacturing Resilience:</strong> Robust power electronics engineered for continuous 24/7 industrial duty, high harmonic tolerance, and high ambient temperatures.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">Customer-Centric Engineering:</strong> In-house consultation from power requirement definition and sizing through site commissioning and ongoing maintenance agreements.
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Genesis Power Equipments Pvt. Ltd.</span>
                <span className="text-amber-400 font-semibold">Chennai, India</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CompanyIntroSection;
