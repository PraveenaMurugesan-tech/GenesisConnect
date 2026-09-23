import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sliders,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  FileText,
  X,
  Building2,
  Mail,
  Phone,
  Cpu,
  ChevronRight,
  Info,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

interface CustomFormState {
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  productType: string;
  capacity: string;
  batterySpecs: string;
  backupRequirements: string;
  equipmentInfo: string;
  additionalRequirements: string;
}

interface CustomFormErrors {
  customerName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  capacity?: string;
  equipmentInfo?: string;
}

export const CustomizedRequirementPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productOptions = [
    { value: "industrial_ups", label: "Industrial Online Double-Conversion UPS" },
    { value: "ct_cath_lab_ups", label: "Healthcare / CT Scanner / Cath Lab UPS" },
    { value: "igbt_stabilizer", label: "IGBT Static PWM Voltage Stabilizer" },
    { value: "servo_stabilizer", label: "Heavy Duty Servo Voltage Stabilizer" },
    { value: "cvcf_converter", label: "CVCF Static Frequency Converter (50/60/400 Hz)" },
    { value: "custom_power_plant", label: "Turnkey Power System / Custom Switchgear" },
    { value: "other_specialized", label: "Other Specialized Electrical Architecture" },
  ];

  const [formData, setFormData] = useState<CustomFormState>({
    customerName: "",
    companyName: "",
    email: "",
    phone: "",
    productType: "industrial_ups",
    capacity: "",
    batterySpecs: "",
    backupRequirements: "",
    equipmentInfo: "",
    additionalRequirements: "",
  });

  const [errors, setErrors] = useState<CustomFormErrors>({});
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requirementReference, setRequirementReference] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof CustomFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;
      setSelectedFile({ name: file.name, size: sizeStr });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = (): boolean => {
    const newErrors: CustomFormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Contact representative name is required.";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company or facility name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Official business email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile or contact number is required.";
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = "Please enter a valid phone number (minimum 8 digits).";
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = "Desired capacity rating is required (e.g. 100 kVA, 500 kVA).";
    }

    if (!formData.equipmentInfo.trim()) {
      newErrors.equipmentInfo = "Please describe the equipment or plant load characteristics.";
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
      const randomRef = `GEN-REQ-${Math.floor(10000 + Math.random() * 90000)}`;
      setRequirementReference(randomRef);
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
      productType: "industrial_ups",
      capacity: "",
      batterySpecs: "",
      backupRequirements: "",
      equipmentInfo: "",
      additionalRequirements: "",
    });
    setErrors({});
    setSelectedFile(null);
    setSubmitted(false);
    setRequirementReference("");
  };

  return (
    <div className="py-10 sm:py-14 space-y-12">
      <Container size="md">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Customized Requirement</span>
        </nav>

        {/* Section Header */}
        <SectionHeader
          badge="Specialized Engineering"
          title="Customized Power Requirement Specification"
          subtitle="For non-standard electrical loads, specialized diagnostic imaging suites, extreme ambient temperature sites, or custom multi-unit synchronization setups."
          className="mb-8"
        />

        {/* Phase 2 Architecture Notice */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 mb-8">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Phase 2 Engineering Form Foundation:</span>
            {" "}This intake form layout validates client-side parameters and simulates file selection. Document uploads to Supabase storage and automated engineering review tickets will be wired in Phase 3.
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
                Custom Engineering Specification Recorded
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you. Your customized engineering requirement has been captured for evaluation by <strong>Genesis Power Equipments Pvt. Ltd.</strong>
              </p>
            </div>

            {/* Simulated Dossier Reference */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Requirement Reference:</span>
                <span className="font-mono font-bold text-slate-900">{requirementReference}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Representative:</span>
                <span className="font-semibold text-slate-800">{formData.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Company / Plant:</span>
                <span className="font-semibold text-slate-800">{formData.companyName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Desired Capacity:</span>
                <span className="font-semibold text-amber-700">{formData.capacity}</span>
              </div>
              {selectedFile && (
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Attached Drawing:</span>
                  <span className="font-mono text-slate-800 truncate max-w-[200px]">{selectedFile.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Official Email:</span>
                <span className="font-mono text-slate-800">{formData.email}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our application engineering department reviews custom technical specifications and will contact your team to discuss electrical drawings and configuration options.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button variant="outline" size="md" onClick={handleReset}>
                Submit Another Requirement
              </Button>
              <Link to="/products">
                <Button variant="accent" size="md">
                  View Standard Products
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Main Custom Requirement Intake Form */
          <Card className="shadow-industrial-lg">
            <CardContent className="p-6 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {/* 1. Client & Facility Details */}
                <div className="space-y-4">
                  <div className="space-y-1 border-b border-slate-100 pb-3">
                    <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-sky-700" />
                      1. Client &amp; Facility Information
                    </h3>
                    <p className="text-xs text-slate-500">
                      Primary contact person and plant or hospital location.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Representative Name *"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. K. Narayanan"
                      error={errors.customerName}
                      required
                    />

                    <Input
                      label="Company / Facility Name *"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Chennai Precision Engineering Ltd."
                      error={errors.companyName}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Official Email Address *"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="k.narayanan@company.com"
                      leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                      error={errors.email}
                      required
                    />

                    <Input
                      label="Mobile / Contact No. *"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 94440 00000"
                      leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                      error={errors.phone}
                      required
                    />
                  </div>
                </div>

                {/* 2. Technical Power Parameters */}
                <div className="space-y-4">
                  <div className="space-y-1 border-b border-slate-100 pb-3">
                    <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-amber-600" />
                      2. Electrical Sizing &amp; Parameters
                    </h3>
                    <p className="text-xs text-slate-500">
                      Capacity ratings, battery autonomy duration, and equipment class.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Select
                      label="Target Equipment Architecture *"
                      name="productType"
                      value={formData.productType}
                      onChange={handleChange}
                      options={productOptions}
                      required
                    />

                    <Input
                      label="Desired Total Capacity (kVA / kW) *"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="e.g. 150 kVA / 120 kW (3-Phase 415V)"
                      error={errors.capacity}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Battery Specifications & Chemistry"
                      name="batterySpecs"
                      value={formData.batterySpecs}
                      onChange={handleChange}
                      placeholder="e.g. 12V SMF VRLA / 2V Tubular / LiFePO4"
                      helperText="Specify preferred brand or chemistry if any"
                    />

                    <Input
                      label="Required Backup Autonomy Duration"
                      name="backupRequirements"
                      value={formData.backupRequirements}
                      onChange={handleChange}
                      placeholder="e.g. 15 minutes, 30 minutes, 2 hours..."
                      helperText="Calculated at 100% full continuous load"
                    />
                  </div>
                </div>

                {/* 3. Site Constraints & Load Details */}
                <div className="space-y-4">
                  <div className="space-y-1 border-b border-slate-100 pb-3">
                    <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      3. Equipment Information &amp; Site Conditions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Load characteristics, environmental constraints, and specific switchgear requirements.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      label="Equipment Information & Load Characteristics *"
                      name="equipmentInfo"
                      value={formData.equipmentInfo}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe connected machinery (e.g. Siemens CT scanner, Haas CNC machining center, non-linear harmonic loads, motor inrush factor)..."
                      error={errors.equipmentInfo}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      label="Additional Requirements & Site Constraints"
                      name="additionalRequirements"
                      value={formData.additionalRequirements}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Mention ambient room temperature, IP rating (e.g. IP54/IP55), manual bypass switchboard requirement, external isolation transformer, or cable entry direction..."
                    />
                  </div>
                </div>

                {/* 4. Document / SLD Upload UI (UI-Only in Phase 2) */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    4. Single Line Diagram (SLD) or Technical Drawing (Optional)
                  </label>

                  {selectedFile ? (
                    /* Selected File Chip */
                    <div className="flex items-center justify-between p-4 rounded-xl bg-sky-50 border border-sky-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                            {selectedFile.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Size: {selectedFile.size} • Ready for technical review
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        aria-label="Remove attached file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    /* Drag and Drop Zone */
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-6 text-center bg-slate-50/60 hover:bg-sky-50/30 transition-all cursor-pointer group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.dwg,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-sky-600 group-hover:scale-105 transition-all mx-auto mb-3 shadow-sm">
                        <UploadCloud className="w-6 h-6" />
                      </div>

                      <div className="text-xs font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                        Click to upload Electrical Single Line Diagram (SLD) or Site Layout
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Supported: PDF, DWG, PNG, JPG up to 15MB
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>File upload control is UI-only in Phase 2; direct Supabase storage transfer will connect in Phase 3.</span>
                  </div>
                </div>

                {/* Submit Row */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Reviewed by Genesis senior application engineers.
                  </span>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    isLoading={isSubmitting}
                    leftIcon={<Sliders className="w-4 h-4" />}
                    className="w-full sm:w-auto font-semibold shadow-md"
                  >
                    Submit Custom Engineering Requirement
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

export default CustomizedRequirementPage;
