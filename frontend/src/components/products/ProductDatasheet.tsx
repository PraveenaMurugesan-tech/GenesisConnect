import React from "react";
import { Link } from "react-router-dom";
import { Download, ChevronRight, FileCheck2, Info } from "lucide-react";
import { Button } from "../ui/Button";

export interface ProductDatasheetProps {
  slug: string;
  datasheet?: string;
  productName: string;
}

export const ProductDatasheet: React.FC<ProductDatasheetProps> = ({
  slug,
  datasheet,
  productName,
}) => {
  const hasDatasheet = Boolean(datasheet && !datasheet.startsWith("#"));

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-industrial space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">
            Product Technical Datasheet (PDF)
          </h3>
          <p className="text-xs text-slate-500">
            Official dimensional drawings, single-line diagrams, and detailed wiring manuals.
          </p>
        </div>
      </div>

      {hasDatasheet ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Official engineering specification sheet available for download.</span>
          </div>
          <a
            href={datasheet}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <Button variant="accent" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
              Download PDF
            </Button>
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Datasheet Availability Notice:</span>
            </div>
            <p>
              Detailed datasheets and SLD documents are provided by Genesis Power Equipments Pvt. Ltd. upon formal procurement enquiry or technical consultation.
            </p>
          </div>

          <div>
            <Link to={`/request-quote?product=${slug}`}>
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Request Technical Datasheet for {productName}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDatasheet;
