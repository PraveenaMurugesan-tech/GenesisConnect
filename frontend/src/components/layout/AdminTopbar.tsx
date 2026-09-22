import React from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { Badge } from "../common/Badge";

export interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Mobile Toggle & Status */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            Genesis Power Equipments
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-slate-500">
            Enterprise Admin Console
          </span>
        </div>
      </div>

      {/* Right User Indicator & Status */}
      <div className="flex items-center gap-4">
        <Badge variant="accent" size="sm" dot>
          Phase 1 Foundation
        </Badge>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center font-bold text-xs">
            GP
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
              <span>Admin Operator</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-[10px] text-slate-500">Super Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
