import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sliders, Zap } from "lucide-react";
import { Container } from "../common/Container";
import { Button } from "../ui/Button";

export const HomeCTASection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Subtle radial ambient lights */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container size="md" className="relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-amber-400 text-xs font-semibold uppercase tracking-wider shadow-inner">
          <Zap className="w-3.5 h-3.5 fill-amber-400" />
          <span>Genesis Power Equipments Pvt. Ltd.</span>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Have a specific power requirement?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Talk to Genesis.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
            Whether sizing an online UPS for a hospital radiology wing, stabilizing chronic voltage fluctuations in a factory, or building custom power switchgear, our application engineers are ready to assist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link to="/request-quote" className="w-full sm:w-auto">
            <Button
              variant="accent"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-lg shadow-amber-900/30 font-semibold"
            >
              Request a Quote
            </Button>
          </Link>

          <Link to="/customized-requirement" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              leftIcon={<Sliders className="w-4 h-4 text-sky-400" />}
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white"
            >
              Customized Requirement
            </Button>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-6">
          <span>Direct OEM Consultation</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span>Application-Specific Sizing</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span>Full Load Factory Tested</span>
        </div>
      </Container>
    </section>
  );
};

export default HomeCTASection;
