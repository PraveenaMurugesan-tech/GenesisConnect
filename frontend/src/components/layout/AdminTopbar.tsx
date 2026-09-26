import React, { useState, useEffect } from "react";
import { Menu, ShieldCheck, LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "../../types";

export interface AdminTopbarProps {
  onToggleSidebar: () => void;
  onLogout?: () => void;
  currentUser?: User | null;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  onToggleSidebar,
  onLogout,
  currentUser: propUser,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(propUser || null);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      return;
    }
    const syncUser = () => {
      const stored = localStorage.getItem("genesis_admin_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    syncUser();
    window.addEventListener("auth-state-changed", syncUser);
    return () => window.removeEventListener("auth-state-changed", syncUser);
  }, [propUser]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("genesis_access_token");
      localStorage.removeItem("genesis_admin_user");
      window.dispatchEvent(new Event("auth-state-changed"));
      navigate("/admin/login");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Mobile Toggle & Brand Context */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            Genesis Power Equipments
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-500">
            Control Console
          </span>
        </div>
      </div>

      {/* Right User Indicator & Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Authenticated Session</span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center font-bold text-xs shadow-xs">
            {getInitials(user?.name)}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
              <span>{user?.name || "Genesis Administrator"}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {user?.role || "ADMIN"} &bull; {user?.email || "admin@genesispower.in"}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign out of administrative session"
            className="ml-2 p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
