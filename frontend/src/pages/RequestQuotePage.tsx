import React, { useState } from "react";
import { Zap, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Badge } from "../components/common/Badge";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

export const RequestQuotePage: React.FC = () => {
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
          badge="Commercial Procurement"
          title="Request an Equipment Quotation"
          subtitle="Submit your power generation specifications and our commercial engineering department will prepare a detailed technical proposal."
          className="mb-8"
        />

        {/* Phase 1 Notice */}
        <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Phase 1 UI Foundation:</span>
            {" "}This quotation form demonstrates accessible input fields, selects, error states, and responsive styling. Live database submission, PDF quotation generation, and email alerts will be integrated in Phase 3.
          </div>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-industrial space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-slate-900">
              Quotation Request Received (Demo)
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for testing the GenesisConnect Phase 1 quotation form layout. Your simulated requirement has been captured.
            </p>
            <div className="pt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Contact Person Name"
                    placeholder="e.g. S. Ramaswamy"
                    required
                  />
                  <Input
                    label="Company / Organization"
                    placeholder="e.g. L&T Heavy Engineering"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Official Business Email"
                    type="email"
                    placeholder="name@company.com"
                    required
                  />
                  <Input
                    label="Telephone / Mobile Number"
                    type="tel"
                    placeholder="+91 98400 00000"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="Equipment Category"
                    options={[
                      { value: "dg_set", label: "Industrial Diesel Generator Set" },
                      { value: "acoustic", label: "Acoustic Enclosure / Soundproofing" },
                      { value: "turnkey", label: "Turnkey Captive Power Plant" },
                      { value: "amf_panel", label: "AMF / Synchronization Panels" },
                      { value: "amc", label: "Maintenance Contract (AMC)" },
                    ]}
                    required
                  />

                  <Select
                    label="Estimated Capacity Requirement"
                    options={[
                      { value: "15_125", label: "15 kVA – 125 kVA (Commercial Light)" },
                      { value: "160_500", label: "160 kVA – 500 kVA (Medium Industrial)" },
                      { value: "600_1250", label: "600 kVA – 1250 kVA (Heavy Industrial)" },
                      { value: "1500_3000", label: "1500 kVA – 3000 kVA (Multi-Megawatt)" },
                    ]}
                    required
                  />
                </div>

                <Textarea
                  label="Project Scope / Specific Technical Notes"
                  rows={4}
                  placeholder="Mention site location, sound level constraints, indoor/outdoor requirement, or switchgear specifications..."
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Average response time: &lt; 2 business hours</span>
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    isLoading={isSubmitting}
                    leftIcon={<Zap className="w-4 h-4" />}
                    className="w-full sm:w-auto"
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
