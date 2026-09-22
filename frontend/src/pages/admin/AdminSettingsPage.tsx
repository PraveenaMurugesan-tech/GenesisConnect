import React from "react";
import { User, Shield, Key, Database, Cloud } from "lucide-react";

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
          Route: /admin/settings
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">System & Security Settings</h1>
        <p className="text-xs text-slate-400">Configure administrator profile, security keys, and external service links.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-white text-sm">Administrator Account</h3>
          </div>
          <div className="text-xs space-y-2 text-slate-300">
            <div><strong>Role:</strong> SUPER_ADMIN</div>
            <div><strong>Email:</strong> admin@genesispower.in</div>
            <div><strong>Authentication Method:</strong> JWT Bearer + Passlib Bcrypt</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-white text-sm">External Integrations</h3>
          </div>
          <div className="text-xs space-y-2 text-slate-300">
            <div><strong>Database:</strong> PostgreSQL (SQLAlchemy 2.0 ORM)</div>
            <div><strong>Object Storage:</strong> Supabase Storage</div>
            <div><strong>API Protocol:</strong> RESTful JSON (FastAPI)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
