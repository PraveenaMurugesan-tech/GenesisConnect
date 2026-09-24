import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  FileText,
  ShieldCheck,
  ChevronRight,
  Download,
  AlertCircle,
  Sliders,
  CheckCircle2,
  Cpu,
  Activity,
  Sparkles,
  Phone,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { getProductBySlug } from "../services/productService";

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const product = getProductBySlug(slug);

  // Handle invalid product or missing slug state
  if (!product) {
    return (
      <div className="py-16 sm:py-24">
        <Container size="md">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-industrial space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Equipment Model Not Found
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                The product reference <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 text-xs">/products/{slug || "unknown"}</code> could not be located in the Genesis Power Equipments catalogue.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link to="/products">
                <Button variant="accent" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Equipment Catalog
                </Button>
              </Link>
              <Link to="/customized-requirement">
                <Button variant="outline" size="md" leftIcon={<Sliders className="w-4 h-4" />}>
                  Submit Custom Requirement
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Helper to get matching category icon
  const getProductIcon = () => {
    if (product.slug.includes("medical") || product.slug.includes("ct-scanner") || product.slug.includes("cath-lab") || product.slug.includes("ultrasound")) {
      return <Activity className="w-10 h-10 text-sky-600" aria-hidden="true" />;
    }
    if (product.slug.includes("stabilizer")) {
      return <Cpu className="w-10 h-10 text-amber-600" aria-hidden="true" />;
    }
    if (product.slug.includes("cvcf") || product.slug.includes("custom")) {
      return <Sparkles className="w-10 h-10 text-indigo-600" aria-hidden="true" />;
    }
    return <Zap className="w-10 h-10 text-amber-500" aria-hidden="true" />;
  };

  return (
    <div className="py-10 sm:py-14 space-y-10">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/products" className="hover:text-slate-900 transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Product Overview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header & Title */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline" className="font-mono text-[11px]">Model: {product.slug}</Badge>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="text-base sm:text-lg text-sky-800 font-medium leading-relaxed">
                  {product.tagline}
                </p>
              )}

              <p className="text-base text-slate-600 leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Technical Visual Representation Box */}
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-8 sm:p-10 border border-slate-800 text-white overflow-hidden shadow-xl">
              <div
                className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg flex-shrink-0">
                    {getProductIcon()}
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold block">
                      Genesis Power Equipments Line
                    </span>
                    <h3 className="font-heading text-xl font-bold text-white">
                      {product.name}
                    </h3>
                    <span className="text-xs text-slate-400 block font-mono">
                      Category: {product.category}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700/80 text-right font-mono text-xs text-slate-300">
                  <div className="text-emerald-400 font-bold">Standard Industrial Duty</div>
                  <div className="text-[11px] text-slate-400">100% Quality Inspected</div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  Key Engineering Features
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {product.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-industrial flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Areas */}
            {product.applications && product.applications.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                  Recommended Applications &amp; Environments
                </h2>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                    {product.applications.map((app, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-600 flex-shrink-0" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Specifications Table */}
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-700" />
                Technical Specifications
              </h2>

              <Card>
                <CardHeader className="bg-slate-50/70">
                  <CardTitle className="text-sm font-bold text-slate-800">
                    Standard Technical Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {product.specifications &&
                        (Array.isArray(product.specifications)
                          ? product.specifications.map((spec, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-3.5 font-semibold text-slate-600 w-1/3 sm:w-2/5">
                                  {spec.label}
                                </td>
                                <td className="px-6 py-3.5 text-slate-800">
                                  {spec.value}
                                </td>
                              </tr>
                            ))
                          : Object.entries(product.specifications).map(([key, value], idx) => (
                              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-3.5 font-semibold text-slate-600 w-1/3 sm:w-2/5">
                                  {key}
                                </td>
                                <td className="px-6 py-3.5 text-slate-800">
                                  {String(value)}
                                </td>
                              </tr>
                            )))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <p className="text-xs text-slate-500 italic">
                * Note: Specifications will be provided by Genesis Power Equipments Pvt. Ltd. based on exact site capacity sizing and customized installation requirements.
              </p>
            </div>

            {/* Datasheet Placeholder Card */}
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

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-semibold text-slate-800">Datasheet Availability Notice:</div>
                <p>
                  Datasheets will be provided by Genesis Power Equipments Pvt. Ltd. upon formal procurement enquiry or technical consultation.
                </p>
              </div>

              <div>
                <Link to={`/request-quote?product=${product.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    Request Technical Datasheet
                  </Button>
                </Link>
              </div>
            </div>

            {/* Back to Products Navigation Link */}
            <div className="pt-2">
              <Link to="/products">
                <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to All Products
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar Action Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Primary Request Quote Card */}
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
                  Genesis provides direct OEM pricing, site assessment, and technical consultation for <strong>{product.name}</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <Link to={`/request-quote?product=${product.slug}`} className="block">
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
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
