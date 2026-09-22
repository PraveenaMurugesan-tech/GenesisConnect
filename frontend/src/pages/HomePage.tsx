import React from "react";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Cpu, ArrowRight } from "lucide-react";

export const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      {/* Phase 0 Foundational Banner */}
      <div className="mb-12 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
        GenesisConnect Phase 0 Technical Foundation Established
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Industrial Power Systems & Engineering Solutions
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            Welcome to the GenesisConnect architectural foundation for <strong>Genesis Power Equipments Pvt. Ltd.</strong> Powering heavy industrial manufacturing, healthcare critical infrastructure, and turnkey energy installations.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-all shadow-lg shadow-amber-500/20"
            >
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/request-quote"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-all"
            >
              Request a Quote
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="glass-card rounded-2xl p-6 space-y-6 border border-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              System Architecture Status (Phase 0)
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <Cpu className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">FastAPI Backend API</div>
                  <div className="text-slate-400">PostgreSQL models, Alembic migrations, and REST contracts configured.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Role-Based Admin Strategy</div>
                  <div className="text-slate-400">JWT security, password hashing, and admin guards structured.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Supabase Storage Architecture</div>
                  <div className="text-slate-400">Decoupled bucket architecture for datasheets and images.</div>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              Detailed UI implementation will be executed in Phase 1.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
