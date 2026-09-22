import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  FileText,
  ShieldCheck,
  ChevronRight,
  Download,
  Info,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Human-readable title from slug for placeholder demonstration
  const formattedTitle = slug
    ? slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Industrial Power Equipment";

  return (
    <div className="py-12 sm:py-16 space-y-10">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-800 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/products" className="hover:text-slate-800 transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
            {formattedTitle}
          </span>
        </nav>

        {/* Phase 1 Route Architecture Notice */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3 text-xs text-sky-900 mb-8">
          <Info className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Route Architecture Verified:</span>
            {" "}You are viewing route <code className="font-mono bg-sky-100 px-1 py-0.5 rounded text-sky-800">/products/:slug</code> with parameter <code className="font-mono bg-sky-100 px-1 py-0.5 rounded text-sky-800">{slug || "unknown"}</code>. In Phase 2, this view will dynamically fetch the product model from PostgreSQL and render high-resolution technical diagrams and downloadable PDF datasheets.
          </div>
        </div>

        {/* Product Overview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Specs & Information */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Industrial DG Set</Badge>
                <Badge variant="accent">CPCB-II Compliant</Badge>
                <Badge variant="outline">Slug: {slug}</Badge>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {formattedTitle}
              </h1>

              <p className="text-base text-slate-600 leading-relaxed">
                Industrial grade continuous-power diesel generating system engineered for mission-critical manufacturing facilities, healthcare complexes, and commercial installations.
              </p>
            </div>

            {/* Technical Specifications Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-4 h-4 text-sky-700" />
                  Engineering Specifications (Foundation Schema)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-3.5 font-medium text-slate-500 w-1/3">Standby Power Rating</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-800">500 kVA / 400 kWe</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-3.5 font-medium text-slate-500">Prime Power Rating</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-800">450 kVA / 360 kWe</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-3.5 font-medium text-slate-500">Voltage & Frequency</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-800">415 Volts, 50 Hz, 3 Phase, 0.8 PF</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-3.5 font-medium text-slate-500">Engine Governor</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-800">Electronic Governor (Class A1)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-3.5 font-medium text-slate-500">Cooling System</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-800">Water Cooled, Heavy-Duty Radiator (50°C ambient)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-3.5 font-medium text-slate-500">Acoustic Sound Level</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-800">&lt; 75 dBA at 1 meter (CPCB-II Certified)</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/products">
                <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to All Products
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar Action Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-industrial space-y-6">
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Request Equipment Pricing
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Genesis provides direct OEM pricing, installation drawings, and technical consultation for this equipment.
                </p>
              </div>

              <div className="space-y-3">
                <Link to="/request-quote" className="block">
                  <Button variant="accent" size="lg" fullWidth leftIcon={<Zap className="w-4 h-4" />}>
                    Request Quotation
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => alert("Datasheet downloads will be connected in Phase 2 via Supabase storage.")}
                >
                  Download Datasheet (PDF)
                </Button>
              </div>

              <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Warranty & Support</span>
                </div>
                <p>
                  Includes 24 months OEM warranty, on-site commissioning by certified engineers, and 24/7 technical hotline access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
