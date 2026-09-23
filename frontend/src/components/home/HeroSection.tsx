import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Shield,
  ArrowRight,
  Activity,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { Container } from "../common/Container";
import { Button } from "../ui/Button";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-slate-950 text-white pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden border-b border-slate-800">
      {/* Background industrial grid & glow effects */}
      <div
        className="absolute inset-0 opacity-15 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-40 -right-40 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container size="lg" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Corporate Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Corporate Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Genesis Power Equipments Pvt. Ltd.
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Industrial Power Protection &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-amber-300">
                Precision Voltage Systems
              </span>
            </h1>

            {/* Sub-text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Engineering reliable online double-conversion UPS systems, high-speed static &amp; servo voltage stabilizers, CVCF converters, and specialized medical imaging power protection for continuous industrial operations.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/request-quote">
                <Button
                  variant="accent"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="shadow-lg shadow-amber-900/30 font-semibold"
                >
                  Request a Quote
                </Button>
              </Link>

              <Link to="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-slate-900/80 text-white border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                >
                  Explore Products
                </Button>
              </Link>
            </div>

            {/* Key Capability Highlights */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Transfer Time</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Sub-Cycle Regulation</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Healthcare &amp; Industrial Duty</span>
              </div>
            </div>
          </div>

          {/* Right Column: Industrial Technical Dashboard Display Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-7 border border-slate-800 shadow-2xl shadow-slate-950/80 space-y-6">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Zap className="w-4 h-4 fill-sky-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white block">
                      Power Topology Active
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Genesis Engineering Architecture
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Online Protected
                </span>
              </div>

              {/* Power Flow Simulation Diagram */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/90 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Mains Utility In</span>
                  <span>Galvanic Isolation</span>
                  <span>Protected Load</span>
                </div>

                <div className="relative flex items-center justify-between gap-2 py-2">
                  <div className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-center">
                    <span className="text-slate-400 block text-[10px] uppercase">Input</span>
                    <span className="text-amber-400 font-bold">415 V</span>
                    <span className="text-[10px] text-slate-500 block">3-Phase 50Hz</span>
                  </div>

                  <div className="w-6 h-0.5 bg-sky-500/60 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  </div>

                  <div className="flex-1 bg-slate-900 border border-sky-500/40 rounded-lg p-2.5 text-center shadow-sm shadow-sky-500/10">
                    <span className="text-sky-300 block text-[10px] uppercase font-sans font-semibold">Genesis DSP</span>
                    <span className="text-white font-bold">Double-Conv</span>
                    <span className="text-[10px] text-sky-400 block">&lt; 20ms Correct</span>
                  </div>

                  <div className="w-6 h-0.5 bg-emerald-500/60 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  <div className="flex-1 bg-slate-900 border border-emerald-500/40 rounded-lg p-2.5 text-center shadow-sm shadow-emerald-500/10">
                    <span className="text-emerald-400 block text-[10px] uppercase">Clean Out</span>
                    <span className="text-emerald-300 font-bold">Pure Sine</span>
                    <span className="text-[10px] text-emerald-400/80 block">0 ms Transfer</span>
                  </div>
                </div>
              </div>

              {/* Engineering Feature Metrics */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <Shield className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Medical Imaging &amp; Industrial Immunity</span>
                    <span className="text-slate-400 text-[11px]">
                      Engineered to absorb sudden pulsed loads for CT scanners and precision CNC tooling.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <Activity className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Sub-Cycle Voltage Stabilization</span>
                    <span className="text-slate-400 text-[11px]">
                      Solid-state IGBT switching with zero mechanical moving parts and high thermal withstand.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <Cpu className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Turnkey Custom Engineering</span>
                    <span className="text-slate-400 text-[11px]">
                      Sized, built, and commissioned to exact facility single-line diagrams (SLD).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
