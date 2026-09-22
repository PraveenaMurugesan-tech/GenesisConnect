import React from "react";
import { Wrench, ShieldCheck, CheckCircle } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Card, CardContent } from "../../components/ui/Card";

export const AdminServicesPage: React.FC = () => {
  const serviceCategories = [
    { title: "Preventive AMC Contracts", activeContracts: 38, engineersAssigned: 12 },
    { title: "Load Bank Testing & Diagnostics", activeContracts: 6, engineersAssigned: 4 },
    { title: "Overhaul & Turnkey Commissioning", activeContracts: 9, engineersAssigned: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="accent">Field Operations</Badge>
          <span className="text-xs text-slate-500 font-mono">/admin/services</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Engineering Services & AMC Administration
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage service offerings, engineer assignment schedules, and preventive maintenance agreements.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Phase 1 Route Foundation:</span>
          {" "}This administrative services overview demonstrates layout and card conventions. Full field service dispatching and contract renewal tracking will be connected in Phase 4.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceCategories.map((s, idx) => (
          <Card key={idx} hover>
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">{s.title}</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span>Active Client Accounts:</span>
                  <span className="font-bold text-slate-900">{s.activeContracts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Field Technicians Assigned:</span>
                  <span className="font-bold text-slate-900">{s.engineersAssigned}</span>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Operational Module</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminServicesPage;
