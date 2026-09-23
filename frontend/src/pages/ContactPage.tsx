import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
  ShieldCheck,
  ChevronRight,
  Building2,
  HelpCircle,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { COMPANY_INFO } from "../data/company";

interface ContactFormState {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormState>({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messageReference, setMessageReference] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Your name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telephone or mobile number is required.";
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = "Please enter a valid phone number (minimum 8 digits).";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Message subject is required.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message text is required.";
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
      const randomRef = `GEN-MSG-${Math.floor(10000 + Math.random() * 90000)}`;
      setMessageReference(randomRef);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      companyName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setErrors({});
    setSubmitted(false);
    setMessageReference("");
  };

  return (
    <div className="py-10 sm:py-14 space-y-12">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Contact Us</span>
        </nav>

        {/* Section Header */}
        <SectionHeader
          badge="Communications"
          title="Contact Genesis Power Equipments"
          subtitle="Get in touch with our application engineers, technical support desk, or corporate headquarters in Chennai."
          className="mb-8"
        />

        {/* Phase 2 Architecture Notice */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3 text-xs text-sky-900 mb-8">
          <ShieldCheck className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Phase 2 Contact Interface:</span>
            {" "}Verified corporate contact information and interactive message validation. Message storage in PostgreSQL and email notification webhooks will be connected in Phase 3.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Corporate Directory Cards */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-industrial">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
                    Corporate Headquarters
                  </span>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    {COMPANY_INFO.legalName}
                  </h3>
                </div>

                <div className="space-y-5 text-sm text-slate-600">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Office &amp; Engineering Works</div>
                      <div>{COMPANY_INFO.contact.address.line1}</div>
                      <div>
                        {COMPANY_INFO.contact.address.city}, {COMPANY_INFO.contact.address.state} {COMPANY_INFO.contact.address.postalCode}, {COMPANY_INFO.contact.address.country}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">General Board Line</div>
                      <a
                        href={`tel:${COMPANY_INFO.contact.phones.boardRaw}`}
                        className="text-sky-700 hover:underline font-mono text-xs sm:text-sm"
                      >
                        {COMPANY_INFO.contact.phones.board}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Headphones className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">24/7 Breakdown &amp; AMC Technical Hotline</div>
                      <a
                        href={`tel:${COMPANY_INFO.contact.phones.hotlineRaw}`}
                        className="text-emerald-700 hover:underline font-mono text-xs sm:text-sm font-semibold"
                      >
                        {COMPANY_INFO.contact.phones.hotline}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Official Electronic Mail</div>
                      <div>
                        <a
                          href={`mailto:${COMPANY_INFO.contact.emails.general}`}
                          className="text-sky-700 hover:underline block"
                        >
                          {COMPANY_INFO.contact.emails.general}
                        </a>
                        <a
                          href={`mailto:${COMPANY_INFO.contact.emails.sales}`}
                          className="text-slate-500 hover:underline text-xs block mt-0.5"
                        >
                          Commercial: {COMPANY_INFO.contact.emails.sales}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-2 border-t border-slate-100">
                    <Clock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Operating Hours</div>
                      <div>{COMPANY_INFO.contact.workingHours.office}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {COMPANY_INFO.contact.workingHours.technicalSupport}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Action Reference Card */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
              <h4 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Direct Procurement Consultation
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                If you already have equipment specifications or a single-line diagram, you can also submit directly via our dedicated forms:
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/request-quote"
                  className="inline-flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-amber-400 transition-colors"
                >
                  <span>Request an Equipment Quotation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/customized-requirement"
                  className="inline-flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-sky-400 transition-colors"
                >
                  <span>Custom Engineering Requirement</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-industrial space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Inquiry Message Transmitted
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you. Your message has been received by <strong>Genesis Power Equipments Pvt. Ltd.</strong>
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-2.5 text-xs text-slate-700">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Inquiry ID:</span>
                    <span className="font-mono font-bold text-slate-900">{messageReference}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Sender Name:</span>
                    <span className="font-semibold text-slate-800">{formData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Subject:</span>
                    <span className="font-medium text-slate-800">{formData.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-slate-800">{formData.email}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  A Genesis application engineer will review your inquiry and reply promptly.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                  <Button variant="outline" size="md" onClick={handleReset}>
                    Send Another Message
                  </Button>
                  <Link to="/">
                    <Button variant="accent" size="md">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <Card className="shadow-industrial-lg">
                <CardContent className="p-6 sm:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="space-y-1 border-b border-slate-100 pb-4">
                      <h3 className="font-heading text-lg font-bold text-slate-900">
                        Send Direct Message to Engineering Team
                      </h3>
                      <p className="text-xs text-slate-500">
                        Fill out the details below and an application engineer will reply promptly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Your Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        error={errors.name}
                        required
                      />

                      <Input
                        label="Company / Facility Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Precision Industries"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Email Address *"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ramesh@company.com"
                        leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                        error={errors.email}
                        required
                      />

                      <Input
                        label="Phone / Mobile Number *"
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

                    <Input
                      label="Inquiry Subject *"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Inquiry regarding Industrial UPS maintenance / IGBT stabilizer"
                      error={errors.subject}
                      required
                    />

                    <Textarea
                      label="Your Message *"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Please describe your equipment inquiry, site location, or service requirement..."
                      error={errors.message}
                      required
                    />

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>All inquiries reviewed by Genesis engineering team</span>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isSubmitting}
                        leftIcon={<Send className="w-4 h-4" />}
                        className="w-full sm:w-auto font-semibold shadow-md"
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
