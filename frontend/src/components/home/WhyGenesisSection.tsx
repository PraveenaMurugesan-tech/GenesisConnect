import React from "react";
import { Link } from "react-router-dom";
import {
  Cpu,
  ShieldCheck,
  Wrench,
  Activity,
  Sliders,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeader } from "../common/SectionHeader";
import { Button } from "../ui/Button";

export const WhyGenesisSection: React.FC = () => {
  const strengths = [
    {
      icon: <Cpu className="w-6 h-6 text-sky-600" />,
      title: "Engineering-Focused Solutions",
      description:
        "We evaluate power quality, inrush current characteristics, harmonic loads, and facility constraints to engineer solutions tailored to your real-world electrical environment.",
    },
    {
      icon: <Activity className="w-6 h-6 text-amber-600" />,
      title: "Mission-Critical Power Protection",
      description:
        "Specialized experience safeguarding demanding pulsed healthcare equipment (CT scanners, Cath Labs) and sensitive industrial automation where power failure is not an option.",
    },
    {
      icon: <Sliders className="w-6 h-6 text-emerald-600" />,
      title: "Customized Technical Requirements",
      description:
        "From non-standard input voltages and lithium battery integration to custom outdoor weatherized enclosures and bypass switchgear, we accommodate complex engineering specifications.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      title: "Quality-Oriented Rigor",
      description:
        "Every equipment unit undergoes comprehensive multi-step inspection, dielectric safety verification, and full-load validation prior to site commissioning.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      title: "Deep Product Expertise",
      description:
        "In-depth domain knowledge across online double-conversion UPS, sub-cycle solid-state IGBT stabilizers, servo stabilizers, and CVCF frequency converters.",
    },
    {
      icon: <Wrench className="w-6 h-6 text-sky-500" />,
      title: "Dedicated Lifecycle Support",
      description:
        "Responsive after-sales service, structured Annual Maintenance Contracts (AMC), genuine OEM replacement spares, and emergency breakdown response.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      {/* Background industrial pattern */}
      <div
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />

      <Container size="lg" className="relative z-10">
        <SectionHeader
          badge="Why Genesis"
          title="Engineered Reliability Without Compromise"
          subtitle="Our engineering foundation is built on technical integrity, rigorous manufacturing standards, and direct client collaboration."
          align="center"
          className="mb-14 [&_h2]:text-white [&_p]:text-slate-300"
        />

        {/* Strengths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {strengths.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-colors space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
                {item.icon}
              </div>
              <h3 className="font-heading text-lg font-bold text-white">
                {item.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Context Banner */}
        <div className="mt-14 pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-400">
            Learn more about our company background, testing infrastructure, and quality principles.
          </p>
          <Link to="/about">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white text-xs"
            >
              Read About Genesis
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default WhyGenesisSection;
