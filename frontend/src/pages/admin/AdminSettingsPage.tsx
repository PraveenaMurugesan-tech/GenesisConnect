import React from "react";
import { ShieldCheck, Key, Database, Shield } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Card, CardContent } from "../../components/ui/Card";

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="accent">Configuration</Badge>
          <span className="text-xs text-slate-500 font-mono">/admin/settings</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          System Configuration & Security Settings
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Configure API credentials, administrative access controls, and notification dispatch rules.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Phase 1 Route Foundation:</span>
          {" "}Settings route structure active. Role-based user administration, SMTP email keys, and backup policies will be connected in Phase 4.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900">User Access & Roles</h3>
            <p className="text-xs text-slate-600">
              Manage SUPER_ADMIN and ADMIN role assignments, staff credentials, and active tokens.
            </p>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900">API & Supabase Keys</h3>
            <p className="text-xs text-slate-600">
              Manage Supabase storage keys, bucket policies, and FastAPI backend CORS parameters.
            </p>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900">Database & Backups</h3>
            <p className="text-xs text-slate-600">
              PostgreSQL connection telemetry, Alembic schema revision tracking, and automated snapshots.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
