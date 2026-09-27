import React from "react";
import { Key, Database, Shield, Server, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            <Server className="w-3.5 h-3.5 text-slate-600" />
            System Governance
          </span>
          <span className="text-xs text-slate-400 font-mono">/admin/settings</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          System Architecture &amp; Security Settings
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Technical configuration, database schema revisions, and operational governance for GenesisConnect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Security & Access */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Authentication &amp; Access Controls
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Role-based access control protecting administrative endpoints and CMS data mutations.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Auth Standard:</span>
                <span className="font-mono font-semibold text-slate-900">JWT (HS256)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Password Hashing:</span>
                <span className="font-mono font-semibold text-slate-900">Argon2 / Bcrypt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Admin Roles:</span>
                <span className="font-semibold text-emerald-700">SUPER_ADMIN, ADMIN</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database & Migrations */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                Database &amp; Schema Engine
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Relational persistence layer managing products, services, announcements, and CMS content.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Engine:</span>
                <span className="font-mono font-semibold text-slate-900">PostgreSQL 15+</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ORM:</span>
                <span className="font-mono font-semibold text-slate-900">SQLAlchemy 2.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Migration Tool:</span>
                <span className="font-mono font-semibold text-slate-900">Alembic</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API & Cloud Infrastructure */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900">
                API Backend &amp; Integration
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Asynchronous REST API framework powering customer portal and admin CMS interfaces.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Backend Framework:</span>
                <span className="font-mono font-semibold text-slate-900">FastAPI</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Documentation:</span>
                <span className="font-mono font-semibold text-slate-900">Swagger / OpenAPI</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Storage Interface:</span>
                <span className="font-mono font-semibold text-slate-900">Supabase Storage</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Schema Status Box */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <h3 className="font-heading text-sm font-bold text-slate-900">
                Alembic Schema Revisions (Phase 6)
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Schema Code Complete
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-mono font-bold text-slate-700">0001_initial_schema</span>
              <p className="text-slate-500 mt-0.5">Users, Products, Product Images &amp; Documents</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-mono font-bold text-slate-700">0002_create_enquiries_table</span>
              <p className="text-slate-500 mt-0.5">Enquiry and Quotation capture schema</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-mono font-bold text-slate-700">0003_create_cms_tables</span>
              <p className="text-slate-500 mt-0.5">Services, Site Content, Announcements</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
