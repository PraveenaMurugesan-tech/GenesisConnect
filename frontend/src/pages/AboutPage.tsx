import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Cpu,
  Activity,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Zap,
  Layers,
  FileCheck2,
  HelpCircle,
  Building2,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const AboutPage: React.FC = () => {
  return (
    <div className="py-10 sm:py-14 space-y-16">
      {/* 1. Page Header & Breadcrumbs */}
      <Container size="lg">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">About Us</span>
        </nav>

        <SectionHeader
          badge="Company Overview"
          title="About Genesis Power Equipments Pvt. Ltd."
          subtitle="An established engineering company dedicated to industrial power conditioning, online double-conversion UPS, precision voltage stabilization, and healthcare power resilience."
          className="mb-0"
        />
      </Container>

      {/* 2. Company Overview & Mission */}
      <section className="bg-white py-14 border-y border-slate-200/80">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5 text-slate-600 text-sm sm:text-base leading-relaxed">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Engineering Electrical Resilience for Demanding Applications
              </h2>

              <p>
                <strong>Genesis Power Equipments Pvt. Ltd.</strong> specializes in the design, configuration, supply, and servicing of high-reliability power systems. Headquartered in Chennai, India, we address complex electrical power quality challenges for manufacturing industries, healthcare facilities, scientific institutions, and commercial infrastructure.
              </p>

              <p>
                Modern electrical environments are increasingly vulnerable to voltage sags, chronic brownouts, utility grid switching spikes, and severe harmonic distortion caused by non-linear loads. At Genesis, our mission is to ensure that critical equipment operates seamlessly without interruption, thermal stress, or premature component degradation.
              </p>

              <p>
                From compact workstations to high-capacity multi-kilovolt-ampere industrial plants, our systems are engineered for continuous operational duty and tested against rigorous performance benchmarks.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
                  <Building2 className="w-4 h-4 text-sky-700" />
                  <span>Corporate Office &amp; Works: Chennai, India</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Industrial Engineering Standards</span>
                </div>
              </div>
            </div>

            {/* Strategic Pillars Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-900 text-white p-7 sm:p-8 border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Zap className="w-4 h-4" />
                  <span>Our Core Principles</span>
                </div>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="space-y-1">
                    <span className="font-bold text-white text-sm block">1. Technical Integrity</span>
                    <p className="text-slate-400 leading-relaxed">
                      We specify equipment ratings and topologies based on empirical load analysis and measured electrical site profiles.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-white text-sm block">2. Mission-Critical Reliability</span>
                    <p className="text-slate-400 leading-relaxed">
                      Zero-compromise power continuity for life-critical healthcare diagnostic suites and automated industrial lines.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-white text-sm block">3. Responsive Partnership</span>
                    <p className="text-slate-400 leading-relaxed">
                      Direct engineering support from initial specification review through installation, commissioning, and preventive maintenance.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-400 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Detailed corporate governance records and formal credential filings are available directly upon client request.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Our Engineering Approach */}
      <Container size="lg">
        <SectionHeader
          badge="Methodology"
          title="Our Engineering Approach"
          subtitle="How Genesis designs and delivers robust power solutions from initial concept to turnkey operation."
          align="center"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hover>
            <CardContent className="p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                1. Load Profiling &amp; Sizing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We analyze motor inrush multipliers, pulsed diagnostic current draws, non-linear crest factors, and ambient site parameters to prevent undersizing and nuisance tripping.
              </p>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                2. Power Electronics Topology
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Implementing true online double conversion, solid-state IGBT PWM switching, and galvanic isolation transformers tailored to the specific electrical noise profile of the site.
              </p>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                3. Lifecycle Maintenance
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Comprehensive maintenance agreements, thermal infrared connection audits, battery health diagnostic tracking, and rapid on-site breakdown response.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>

      {/* 4. Domain Expertise Matrix */}
      <section className="bg-slate-900 text-white py-16 border-y border-slate-800">
        <Container size="lg">
          <SectionHeader
            badge="Technical Specialization"
            title="Domain & Product Expertise"
            subtitle="Deep engineering capability spanning healthcare diagnostic imaging, heavy manufacturing, and power conditioning."
            align="center"
            className="mb-14 [&_h2]:text-white [&_p]:text-slate-300"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-7 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Healthcare &amp; Diagnostic Imaging Power
                  </h3>
                  <span className="text-xs text-sky-300">CT Scanners, Cath Labs &amp; Ultrasound</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                High-energy diagnostic medical systems require instantaneous pulse absorption without voltage dips that compromise imaging resolution. Genesis specializes in CT Scanner UPS, Cath Laboratory UPS, and specialized Ultrasound EMI filters that eliminate line-borne acoustic artifacts.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">Zero Scan Abortion</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">Medical Isolation</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">Sub-Cycle Response</span>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Industrial &amp; Turnkey Power Systems
                  </h3>
                  <span className="text-xs text-amber-300">Continuous Duty Plant Resilience</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Continuous manufacturing operations, automation cells, and process facilities rely on ruggedized online industrial UPS and high-speed IGBT static voltage stabilizers designed to operate reliably in high ambient temperatures with heavy harmonic distortion.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">IGBT Solid State</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">Servo Controlled</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">CVCF Conversion</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Quality, Verification & Transparency */}
      <Container size="lg">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-industrial space-y-6">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <h3 className="font-heading text-xl font-bold text-slate-900">
              Quality Assurance &amp; Verification Protocol
            </h3>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Genesis Power Equipments operates under documented quality procedures. Prior to customer dispatch, every unit is subjected to functional safety checks, insulation resistance verification, full-load burn-in testing, and automatic static transfer validation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Full load temperature rise &amp; heat dissipation verification</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Waveform harmonic distortion (THD) oscilloscope testing</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Sub-cycle transient voltage recovery measurement</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
            <strong>Documentation Notice:</strong> Specifications, certifications, and formal test reports will be provided by Genesis Power Equipments Pvt. Ltd. upon formal project consultation.
          </div>
        </div>
      </Container>

      {/* 6. Call To Action Banner */}
      <Container size="lg">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
              Looking for Engineered Power Protection?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Connect directly with our engineering department to discuss your equipment specs, site parameters, or maintenance requirements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/request-quote">
              <Button variant="accent" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Request a Quote
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="md"
                className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white"
              >
                Contact Our Office
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
