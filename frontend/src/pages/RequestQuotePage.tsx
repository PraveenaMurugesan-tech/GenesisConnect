import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Send,
  Building2,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { getProducts } from "../services/productService";

interface FormState {
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  productSlug: string;
  capacity: string;
  message: string;
}

interface FormErrors {
  customerName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  productSlug?: string;
  message?: string;
}

export const RequestQuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedProduct = searchParams.get("product") || "";

  const allProducts = getProducts();

  const productOptions = [
    { value: "", label: "-- Select an Equipment Line --" },
    ...allProducts.map((p) => ({
      value: p.slug,
      label: `${p.name} (${p.category})`,
    })),
    { value: "general_power_consultation", label: "General Power Engineering Consultation" },
    { value: "other_custom", label: "Other / Custom Specification" },
  ];

  const [formData, setFormData] = useState<FormState>({
    customerName: "",
    companyName: "",
    email: "",
    phone: "",
    productSlug: "",
    capacity: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteReference, setQuoteReference] = useState("");

  // Auto-select product if passed in URL query param
  useEffect(() => {
    if (preselectedProduct) {
      const match = allProducts.find((p) => p.slug === preselectedProduct);
      if (match) {
        setFormData((prev) => ({ ...prev, productSlug: match.slug }));
      }
    }
  }, [preselectedProduct, allProducts]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for field if user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Contact person name is required.";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company or facility name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Business email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telephone or mobile number is required.";
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = "Please enter a valid phone number (minimum 8 digits).";
    }

    if (!formData.productSlug) {
      newErrors.productSlug = "Please select an equipment model or service category.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please describe your site requirement or technical scope.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate transient frontend submission latency (no live backend in Phase 2)
    setTimeout(() => {
      const randomRef = `GEN-QT-${Math.floor(10000 + Math.random() * 90000)}`;
      setQuoteReference(randomRef);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      customerName: "",
      companyName: "",
      email: "",
      phone: "",
      productSlug: "",
      capacity: "",
      message: "",
    });
    setErrors({});
    setSubmitted(false);
    setQuoteReference("");
  };

  return (
    <div className="py-10 sm:py-14 space-y-12">
      <Container size="md">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Request a Quote</span>
        </nav>

        {/* Section Header */}
        <SectionHeader
          badge="Commercial Procurement"
          title="Request an Equipment Quotation"
          subtitle="Submit your power requirements and our commercial engineering department will prepare a formal technical and commercial proposal."
          className="mb-8"
        />

        {/* Phase 2 Architecture Notice */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3 text-xs text-sky-900 mb-8">
          <ShieldCheck className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Phase 2 Frontend Validation Mode:</span>
            {" "}This quotation form validates client fields, handles dynamic preselection from the product catalogue, and simulates submission flow. Live FastAPI database dispatch and PDF generation will connect in Phase 3.
          </div>
        </div>

        {submitted ? (
          /* Submission Confirmation View */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-industrial space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Quotation Request Recorded
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for submitting your enquiry to <strong>Genesis Power Equipments Pvt. Ltd.</strong>
              </p>
            </div>

            {/* Simulated Quotation Dossier Reference */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Enquiry Reference:</span>
                <span className="font-mono font-bold text-slate-900">{quoteReference}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Contact Representative:</span>
                <span className="font-semibold text-slate-800">{formData.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Company / Plant:</span>
                <span className="font-semibold text-slate-800">{formData.companyName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Selected Equipment:</span>
                <span className="font-semibold text-sky-700">
                  {allProducts.find((p) => p.slug === formData.productSlug)?.name || formData.productSlug}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Official Email:</span>
                <span className="font-mono text-slate-800">{formData.email}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              In production, our commercial engineering team prepares formal equipment specifications and commercial proposals within 2 business hours.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button variant="outline" size="md" onClick={handleReset}>
                Submit Another Quotation Request
              </Button>
              <Link to="/products">
                <Button variant="accent" size="md">
                  Return to Products Catalog
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Main Quotation Form */
          <Card className="shadow-industrial-lg">
            <CardContent className="p-6 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Section 1: Customer Details */}
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-700" />
                    1. Customer &amp; Organization Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Contact person and company details for quotation addressing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Contact Person Name *"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. S. Ramaswamy"
                    error={errors.customerName}
                    required
                  />

                  <Input
                    label="Company / Facility Name *"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Precision Manufacturing Ltd."
                    error={errors.companyName}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Official Business Email *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    error={errors.email}
                    required
                  />

                  <Input
                    label="Telephone / Mobile Number *"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98400 00000"
                    leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                    error={errors.phone}
                    required
                  />
                </div>

                {/* Section 2: Equipment Scope */}
                <div className="space-y-1 border-b border-slate-100 pb-4 pt-3">
                  <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    2. Equipment Selection &amp; Capacity Scope
                  </h3>
                  <p className="text-xs text-slate-500">
                    Specify the equipment model and desired power capacity.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="Equipment Line / Category *"
                    name="productSlug"
                    value={formData.productSlug}
                    onChange={handleChange}
                    options={productOptions}
                    error={errors.productSlug}
                    required
                  />

                  <Input
                    label="Estimated Capacity / Load Rating"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 50 kVA, 100 kVA, 500 kVA..."
                    helperText="Leave blank if you require Genesis to calculate site capacity"
                  />
                </div>

                {/* Section 3: Project Requirement Notes */}
                <div className="space-y-2">
                  <Textarea
                    label="Project Scope / Specific Technical Notes *"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Mention installation location, indoor/outdoor requirement, battery autonomy duration, hospital equipment brand, or specific voltage constraints..."
                    error={errors.message}
                    required
                  />
                </div>

                {/* Submit Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Average commercial response time: &lt; 2 business hours</span>
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    isLoading={isSubmitting}
                    leftIcon={<Send className="w-4 h-4" />}
                    className="w-full sm:w-auto font-semibold shadow-md"
                  >
                    Generate Technical Quotation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default RequestQuotePage;
