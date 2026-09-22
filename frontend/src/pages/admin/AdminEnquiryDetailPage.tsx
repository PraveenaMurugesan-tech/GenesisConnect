import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck, Mail, Phone, Building } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

export const AdminEnquiryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <Link to="/admin/enquiries">
          <button className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent">Enquiry ID #{id}</Badge>
            <span className="text-xs text-slate-500 font-mono">/admin/enquiries/{id}</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
            Quotation Request Evaluation
          </h1>
        </div>
      </div>

      {/* Phase 1 Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Phase 1 Route Binding:</span>
          {" "}This detail page demonstrates parameter extraction for enquiry #{id}. Commercial PDF generator and status workflow will be connected in Phase 4.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer & Equipment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Building className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-900">L&T Heavy Engineering — Manapakkam Plant</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>ramaswamy.s@lnt.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+91 98400 98765</span>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Requested Solution:</div>
                <div className="font-semibold text-slate-900">500 kVA Silent Diesel Generator with Auto Synchronization Panel</div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Project Description:</div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Require continuous standby backup for manufacturing assembly line 3. CPCB-II acoustic canopy required due to residential buffer zone nearby.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Current Status:</span>
                <Badge variant="accent">NEW</Badge>
              </div>
              <div className="pt-2 space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => alert("Status transitions will be wired in Phase 4.")}
                >
                  Mark as Quoted
                </Button>
                <Link to="/admin/enquiries" className="block">
                  <Button variant="outline" size="sm" fullWidth>
                    Back to Inbox
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiryDetailPage;
