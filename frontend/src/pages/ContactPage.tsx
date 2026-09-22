import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

export const ContactPage: React.FC = () => {
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
      <Container size="lg">
        <SectionHeader
          badge="Communications"
          title="Contact Genesis Power Equipments"
          subtitle="Get in touch with our sales engineers, technical support desk, or corporate headquarters in Chennai."
          className="mb-8"
        />

        {/* Phase 1 Notice */}
        <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Phase 1 Route & Layout:</span>
            {" "}Contact channels and form presentation verified under the Genesis design system. Message inbox dispatching and email notification webhooks will be connected in Phase 3.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-6">
                <h3 className="font-heading text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Chennai Corporate Office & Works
                </h3>

                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Genesis Power Equipments Pvt. Ltd.</div>
                      <div>Industrial Estate, Guindy</div>
                      <div>Chennai, Tamil Nadu 600032, India</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">General Board Line</div>
                      <a href="tel:+914424980000" className="text-sky-700 hover:underline">
                        +91 (0) 44 2498 0000
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Headphones className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">24/7 Breakdown & AMC Hotline</div>
                      <a href="tel:+919840012345" className="text-sky-700 hover:underline">
                        +91 98400 12345 / 24 hrs
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Commercial & Inquiries</div>
                      <a href="mailto:info@genesispower.in" className="text-sky-700 hover:underline">
                        info@genesispower.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Works Operating Hours</div>
                      <div>Monday – Saturday: 8:30 AM – 6:30 PM</div>
                      <div className="text-xs text-slate-500">Emergency service teams on 24/7 standby</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-industrial space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  Inquiry Transmitted (Demo)
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you. Your test message has been received in the Phase 1 frontend layout environment.
                </p>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 sm:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="font-heading text-lg font-bold text-slate-900">
                        Send Direct Message to Engineering Team
                      </h3>
                      <p className="text-xs text-slate-500">
                        Fill out the details below and an engineer will reply promptly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input label="Your Name" placeholder="e.g. Ramesh Kumar" required />
                      <Input label="Company Name" placeholder="e.g. Precision Industries" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input label="Email Address" type="email" placeholder="ramesh@company.com" required />
                      <Input label="Phone Number" type="tel" placeholder="+91 98400 00000" />
                    </div>

                    <Input
                      label="Subject"
                      placeholder="e.g. Inquiry regarding 500 kVA DG Set AMC / Installation"
                      required
                    />

                    <Textarea
                      label="Your Message"
                      rows={5}
                      placeholder="Please describe your equipment requirement, plant location, or service inquiry..."
                      required
                    />

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isSubmitting}
                        leftIcon={<Send className="w-4 h-4" />}
                      >
                        Transmit Message
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
