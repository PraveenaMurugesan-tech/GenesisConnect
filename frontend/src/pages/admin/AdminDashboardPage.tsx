import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Inbox,
  Wrench,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent">Executive Console</Badge>
            <span className="text-xs text-slate-500 font-mono">/admin/dashboard</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Genesis Operations Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Overview of industrial product catalogues, customer enquiries, and maintenance operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products/new">
            <Button variant="accent" size="sm" leftIcon={<Zap className="w-4 h-4" />}>
              Add New Equipment
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Equipment in Catalog
                </p>
                <h3 className="font-heading text-3xl font-extrabold text-slate-900 mt-2">
                  24
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>3 added this month</span>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Enquiries
                </p>
                <h3 className="font-heading text-3xl font-extrabold text-slate-900 mt-2">
                  18
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Inbox className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-700 font-medium">
              <span>5 quotation requests</span>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active AMCs
                </p>
                <h3 className="font-heading text-3xl font-extrabold text-slate-900 mt-2">
                  42
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span>99.8% fleet uptime</span>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  System Health
                </p>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mt-2">
                  Operational
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <span>FastAPI Backend Ready</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading text-base font-bold text-slate-900">
                Equipment Management Module
              </h3>
              <Link to="/admin/products" className="text-xs text-sky-700 hover:underline inline-flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-sm text-slate-600">
              Manage industrial generator specifications, upload single-line diagrams, update power ratings, and publish product categories.
            </p>
            <div className="pt-2 flex gap-3">
              <Link to="/admin/products">
                <Button variant="outline" size="sm">Browse Products</Button>
              </Link>
              <Link to="/admin/products/new">
                <Button variant="primary" size="sm">Create Product</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading text-base font-bold text-slate-900">
                Customer Quotations & Messages
              </h3>
              <Link to="/admin/enquiries" className="text-xs text-sky-700 hover:underline inline-flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-sm text-slate-600">
              Review incoming quotation requests, assign engineering follow-ups, and respond to industrial project requirements.
            </p>
            <div className="pt-2 flex gap-3">
              <Link to="/admin/enquiries">
                <Button variant="outline" size="sm">Open Enquiries Inbox</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
