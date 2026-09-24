import React from "react";
import { Link } from "react-router-dom";
import { Zap, Sliders, ShieldCheck, CheckCircle2, Phone } from "lucide-react";
import { Button } from "../ui/Button";

export interface ProductActionsProps {
  productSlug: string;
  productName: string;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  productSlug,
  productName,
}) => {
  return (
    <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-industrial-lg space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
          <Zap className="w-4 h-4" />
          <span>Commercial Enquiry</span>
        </div>
        <h3 className="font-heading text-xl font-bold text-slate-900">
          Request Equipment Pricing
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Genesis provides direct OEM pricing, site assessment, and technical consultation for{" "}
          <strong>{productName}</strong>.
        </p>
      </div>

      <div className="space-y-3">
        <Link to={`/request-quote?product=${productSlug}`} className="block">
          <Button
            variant="accent"
            size="lg"
            fullWidth
            leftIcon={<Zap className="w-4 h-4" />}
            className="font-semibold shadow-md"
          >
            Request Quotation
          </Button>
        </Link>

        <Link to="/customized-requirement" className="block">
          <Button
            variant="outline"
            size="md"
            fullWidth
            leftIcon={<Sliders className="w-4 h-4" />}
          >
            Custom Requirement
          </Button>
        </Link>
      </div>

      {/* Warranty & Support Trust Box */}
      <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Warranty &amp; Service Assurance</span>
        </div>
        <ul className="space-y-2 text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Direct OEM warranty and factory-tested guarantee</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>On-site commissioning by Genesis engineers</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Structured Annual Maintenance Contract (AMC) options</span>
          </li>
        </ul>
      </div>

      {/* Direct Support Hotline */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
        <div className="text-slate-500 font-medium">Need immediate technical assistance?</div>
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Phone className="w-4 h-4 text-amber-600" />
          <a href="tel:+914424980000" className="hover:text-amber-600 transition-colors">
            +91 (0) 44 2498 0000
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;
