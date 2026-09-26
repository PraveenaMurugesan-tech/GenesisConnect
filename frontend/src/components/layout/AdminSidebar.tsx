import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Inbox,
  Wrench,
  FileText,
  Mail,
  Bell,
  Settings,
  LogOut,
  Zap,
  X,
  ExternalLink,
  Lock,
} from "lucide-react";

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
  isFunctional: boolean;
  badge?: string;
  phaseInfo?: string;
}

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    isFunctional: true,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
    isFunctional: false,
    badge: "Phase 6",
    phaseInfo: "Product CMS & management scheduled for Phase 6",
  },
  {
    name: "Services",
    path: "/admin/services",
    icon: Wrench,
    isFunctional: false,
    badge: "Phase 6",
    phaseInfo: "Services CMS scheduled for Phase 6",
  },
  {
    name: "Enquiries",
    path: "/admin/enquiries",
    icon: Inbox,
    isFunctional: false,
    badge: "Phase 7",
    phaseInfo: "Customer enquiries & requirement workflow scheduled for Phase 7",
  },
  {
    name: "Homepage Content",
    path: "/admin/content",
    icon: FileText,
    isFunctional: false,
    badge: "Phase 6",
    phaseInfo: "Homepage content CMS scheduled for Phase 6",
  },
  {
    name: "Contact Information",
    path: "/admin/contact-info",
    icon: Mail,
    isFunctional: false,
    badge: "Phase 7",
    phaseInfo: "Contact management scheduled for Phase 7",
  },
  {
    name: "Announcements",
    path: "/admin/announcements",
    icon: Bell,
    isFunctional: false,
    badge: "Phase 6",
    phaseInfo: "Announcements manager scheduled for Phase 6",
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
    isFunctional: false,
    badge: "Future",
    phaseInfo: "System preferences & role governance",
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const navigate = useNavigate();

  // Close sidebar on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Admin Navigation"
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 focus:outline-hidden focus:ring-2 focus:ring-amber-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <span className="font-heading font-bold text-base tracking-tight text-white block">
                GENESIS<span className="text-amber-500">ADMIN</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                GenesisConnect Console
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Administrative Modules
          </div>

          {ADMIN_MENU_ITEMS.map((item) => {
            const Icon = item.icon;

            if (item.isFunctional) {
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-800 text-amber-400 border border-slate-700/80 shadow-xs"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-xs shadow-amber-400/50" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            }

            // Non-functional placeholder item for future phases
            return (
              <div
                key={item.name}
                title={item.phaseInfo}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-500 opacity-60 cursor-not-allowed select-none group relative"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-slate-600" aria-hidden="true" />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-600" />
                  {item.badge && (
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/40">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer / Quick Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-400 hover:bg-slate-800/50 transition-colors focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Public Website
            </span>
            <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded font-mono">
              Live
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-rose-500 text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
