import React from "react";
import { ProductSpecification } from "../../types";
import { FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

export interface ProductSpecificationsProps {
  specifications?: ProductSpecification[] | Record<string, any>;
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  specifications,
}) => {
  if (!specifications) return null;

  const specList: { label: string; value: string }[] = Array.isArray(specifications)
    ? specifications
    : Object.entries(specifications).map(([key, value]) => ({
        label: key,
        value: String(value),
      }));

  if (specList.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
        <FileText className="w-5 h-5 text-slate-700" />
        Technical Specifications
      </h2>

      <Card>
        <CardHeader className="bg-slate-50/70 py-3.5 px-6">
          <CardTitle className="text-sm font-bold text-slate-800">
            Standard Technical Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs sm:text-sm">
            <tbody className="divide-y divide-slate-100">
              {specList.map((spec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-slate-600 w-1/3 sm:w-2/5">
                    {spec.label}
                  </td>
                  <td className="px-6 py-3.5 text-slate-800">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-500 italic">
        * Note: Specifications will be provided by Genesis Power Equipments Pvt. Ltd. based on exact site capacity sizing and customized installation requirements.
      </p>
    </div>
  );
};

export default ProductSpecifications;
