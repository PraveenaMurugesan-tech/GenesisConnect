import React from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Card, CardContent } from "../../components/ui/Card";

export const AdminContentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="accent">CMS Console</Badge>
          <span className="text-xs text-slate-500 font-mono">/admin/content</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Website Content Management
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Update corporate profile, hero headlines, case studies, and compliance certifications.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Phase 1 Route Foundation:</span>
          {" "}CMS route structure established. Interactive markdown editors, media library upload, and dynamic page publishing will be configured in Phase 4.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover>
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900">Homepage Banners & Announcements</h3>
            <p className="text-xs text-slate-600">
              Manage hero copy, featured industrial DG sets, and emergency hotline notification bars.
            </p>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900">Company & Certification Documents</h3>
            <p className="text-xs text-slate-600">
              Manage ISO 9001:2015 certificates, CPCB-II emission compliance docs, and corporate brochures.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContentPage;
