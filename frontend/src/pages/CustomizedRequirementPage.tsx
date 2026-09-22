import React, { useState } from "react";
import { Sliders, ShieldCheck, CheckCircle2, UploadCloud, Zap } from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

export const CustomizedRequirementPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <Container size="md">
        <SectionHeader
          badge="Specialized Engineering"
          title="Customized Power Requirement Specification"
          subtitle="For non-standard electrical loads, high-altitude installations, special battery chemistries, or multi-unit synchronization setups."
          className="mb-8"
        />

        {/* Phase 1 Notice */}
        <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Phase 1 Route & Form Layout:</span>
            {" "}This specialized intake form layout establishes the engineering questionnaire schema for complex industrial installations. Full attachment upload to Supabase and automated engineering dispatch will occur in Phase 3.
          </div>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-industrial space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-slate-900">
              Custom Engineering Spec Recorded
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your customized industrial power specifications have been recorded in the Phase 1 UI test environment.
            </p>
            <div className="pt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Specification
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h4 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-sky-700" />
                    1. Client & Facility Details
                  </h4>
                  <p className="text-xs text-slate-500">Contact person and plant location information.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Representative Name" placeholder="e.g. K. Narayanan" required />
                  <Input label="Company / Plant Name" placeholder="e.g. Chennai Auto Components Ltd." required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Official Email" type="email" placeholder="k.narayanan@company.com" required />
                  <Input label="Mobile / Contact No." type="tel" placeholder="+91 94440 00000" required />
                </div>

                <div className="space-y-1 border-b border-slate-100 pb-4 pt-4">
                  <h4 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    2. Power & Electrical Parameters
                  </h4>
                  <p className="text-xs text-slate-500">Target output, backup requirements, and battery specifications.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Desired Total Capacity (kVA / kW)"
                    placeholder="e.g. 1500 kVA N+1 Redundant"
                    required
                  />
                  <Select
                    label="Application Duty Cycle"
                    options={[
                      { value: "emergency", label: "Standby / Emergency Backup Only" },
                      { value: "prime", label: "Prime Power (8-16 hrs daily)" },
                      { value: "continuous", label: "Continuous Base Load (24/7)" },
                      { value: "peak_shaving", label: "Peak Shaving & Tariff Management" },
                    ]}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Battery & Starting Specifications"
                    placeholder="e.g. 24V SMF Heavy Duty / Dual Battery Setup"
                  />
                  <Input
                    label="Backup Duration Requirement"
                    placeholder="e.g. 24 Hours continuous diesel tank"
                  />
                </div>

                <Textarea
                  label="Equipment Technical Scope & Site Constraints"
                  rows={4}
                  placeholder="Describe acoustic restrictions (e.g. hospital zone), chimney height constraints, AMF panel requirements, or special ambient temperature conditions..."
                />

                {/* File Attachment Mock */}
                <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-700">
                    Upload Technical Single Line Diagram (SLD) or Site Layout
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    PDF, DWG, PNG up to 15MB (Backend storage connection in Phase 3)
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    isLoading={isSubmitting}
                    leftIcon={<Sliders className="w-4 h-4" />}
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
