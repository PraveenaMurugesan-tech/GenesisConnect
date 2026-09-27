import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Inbox, Clock } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export const AdminEnquiryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <Link to="/admin/enquiries">
          <button
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200/60">
              <Inbox className="w-3.5 h-3.5 text-purple-600" />
              Enquiry Record #{id}
            </span>
            <span className="text-xs text-slate-400 font-mono">/admin/enquiries/{id}</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
            Customer Enquiry Detail View
          </h1>
        </div>
      </div>

      <Card>
        <CardContent className="p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-heading text-base font-bold text-slate-900">
              Customer Enquiry System Reserved for Phase 7
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enquiry record #{id} cannot be evaluated because the customer enquiry submission pipeline and quotation workflow are scheduled for Phase 7.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/admin/enquiries">
              <Button variant="outline" size="sm">
                Back to Enquiries
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEnquiryDetailPage;
