import React, { useState, useEffect } from "react";
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
  AlertCircle,
  X,
} from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionHeader } from "../components/common/SectionHeader";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { COMPANY_INFO } from "../data/company";
import { apiClient } from "../services/api";
import { submitContactMessage } from "../services/enquiryService";
import { ContactInfo } from "../types";

interface ContactFormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

interface SubmittedContactData {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  referenceId: string;
}

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormState>({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedContactData | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [liveContact, setLiveContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get<ContactInfo>("/content/contact")
      .then((res) => {
        if (isMounted) setLiveContact(res.data);
      })
      .catch(() => {
        // Fallback silently to COMPANY_INFO
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const validate = (): boolean => {
    const newErrors: ContactFormErrors = {};

    // 1. Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Your name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    // 2. Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. name@company.com).";
    }

    // 3. Phone validation
    const phoneTrimmed = formData.phone.trim();
    const phoneDigits = phoneTrimmed.replace(/\D/g, "");
    if (!phoneTrimmed) {
      newErrors.phone = "Phone or mobile number is required.";
    } else if (!/^[\d\s\+\-\(\)\.]{7,25}$/.test(phoneTrimmed) || phoneDigits.length < 8) {
      newErrors.phone = "Please enter a valid telephone or mobile number (minimum 8 digits).";
    }

    // 4. Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Message subject is required.";
    } else if (formData.subject.trim().length < 2) {
      newErrors.subject = "Subject must be at least 2 characters.";
    }

    // 5. Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message text is required.";
    } else if (formData.message.trim().length < 5) {
      newErrors.message = "Please provide more details in your message (minimum 5 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await submitContactMessage({
        name: formData.name.trim(),
        company: formData.company.trim() || undefined,
        company_name: formData.company.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      const refId = `GEN-MSG-${String(res.id).padStart(5, "0")}`;
      setSubmittedData({
        name: formData.name.trim(),
        company: formData.company.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        referenceId: refId,
      });

      // Clear the form fields upon successful HTTP 201 creation
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setErrors({});
      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to submit contact message:", err);
      let errorMsg = "Unable to transmit your message at this time. Please check your network connection and try again.";

      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === "string") {
          errorMsg = detail;
        } else if (Array.isArray(detail)) {
          // Parse Pydantic validation error objects
          const fieldErrors: ContactFormErrors = {};
          const messages: string[] = [];

          detail.forEach((item: any) => {
            const field = item.loc?.[item.loc.length - 1];
            const msg = item.msg || "Invalid value";
            if (field && ["name", "company", "company_name", "email", "phone", "subject", "message"].includes(field)) {
              const mappedField = field === "company_name" ? "company" : field;
              fieldErrors[mappedField as keyof ContactFormErrors] = msg;
            }
            messages.push(`${field ? field + ": " : ""}${msg}`);
          });

          if (Object.keys(fieldErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
          }
          errorMsg = messages.join(" | ");
        } else if (typeof detail === "object") {
          errorMsg = JSON.stringify(detail);
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setServerError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setErrors({});
    setSubmitted(false);
    setSubmittedData(null);
    setServerError(null);
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

        {/* Direct Response Guarantee Notice */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3 text-xs text-sky-900 mb-8">
          <ShieldCheck className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Direct Response Guarantee:</span>
            {" "}All inquiries submitted here are routed directly to our application engineering and corporate support desks in Chennai with rapid turnaround.
          </div>
        </div>

        {serverError && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between mb-6 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
            <button
              type="button"
              onClick={() => setServerError(null)}
              className="text-rose-600 hover:text-rose-800 p-1"
              aria-label="Dismiss error notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
                    {liveContact?.company_name || COMPANY_INFO.legalName}
                  </h3>
                </div>

                <div className="space-y-5 text-sm text-slate-600">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Office &amp; Engineering Works</div>
                      <div>{liveContact?.address_line1 || COMPANY_INFO.contact.address.line1}</div>
                      <div>
                        {liveContact
                          ? `${liveContact.city}, ${liveContact.state} ${liveContact.postal_code}, ${liveContact.country}`
                          : `${COMPANY_INFO.contact.address.city}, ${COMPANY_INFO.contact.address.state} ${COMPANY_INFO.contact.address.postalCode}, ${COMPANY_INFO.contact.address.country}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">General Board Line</div>
                      <a
                        href={`tel:${liveContact?.phone_board || COMPANY_INFO.contact.phones.boardRaw}`}
                        className="text-sky-700 hover:underline font-mono text-xs sm:text-sm"
                      >
                        {liveContact?.phone_board || COMPANY_INFO.contact.phones.board}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Headphones className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">24/7 Breakdown &amp; AMC Technical Hotline</div>
                      <a
                        href={`tel:${liveContact?.phone_hotline || COMPANY_INFO.contact.phones.hotlineRaw}`}
                        className="text-emerald-700 hover:underline font-mono text-xs sm:text-sm font-semibold"
                      >
                        {liveContact?.phone_hotline || COMPANY_INFO.contact.phones.hotline}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Official Electronic Mail</div>
                      <div>
                        <a
                          href={`mailto:${liveContact?.email_general || COMPANY_INFO.contact.emails.general}`}
                          className="text-sky-700 hover:underline block"
                        >
                          {liveContact?.email_general || COMPANY_INFO.contact.emails.general}
                        </a>
                        <a
                          href={`mailto:${liveContact?.email_sales || COMPANY_INFO.contact.emails.sales}`}
                          className="text-slate-500 hover:underline text-xs block mt-0.5"
                        >
                          Commercial: {liveContact?.email_sales || COMPANY_INFO.contact.emails.sales}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-2 border-t border-slate-100">
                    <Clock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Operating Hours</div>
                      <div>{liveContact?.office_hours || COMPANY_INFO.contact.workingHours.office}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {liveContact?.support_hours || COMPANY_INFO.contact.workingHours.technicalSupport}
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
            {submitted && submittedData ? (
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
                    <span className="font-mono font-bold text-slate-900">{submittedData.referenceId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Sender Name:</span>
                    <span className="font-semibold text-slate-800">{submittedData.name}</span>
                  </div>
                  {submittedData.company && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Company:</span>
                      <span className="font-medium text-slate-800">{submittedData.company}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Subject:</span>
                    <span className="font-medium text-slate-800">{submittedData.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-slate-800">{submittedData.email}</span>
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

                    {serverError && (
                      <div
                        role="alert"
                        className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span>{serverError}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setServerError(null)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                          aria-label="Dismiss error"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Your Name"
                        name="name"
                        id="contact-name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        error={errors.name}
                        required
                        disabled={isSubmitting}
                      />

                      <Input
                        label="Company / Facility Name"
                        name="company"
                        id="contact-company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Precision Industries"
                        error={errors.company}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        id="contact-email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ramesh@company.com"
                        leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                        error={errors.email}
                        required
                        disabled={isSubmitting}
                      />

                      <Input
                        label="Phone / Mobile Number"
                        type="tel"
                        name="phone"
                        id="contact-phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98400 00000"
                        leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                        error={errors.phone}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <Input
                      label="Inquiry Subject"
                      name="subject"
                      id="contact-subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Inquiry regarding Industrial UPS maintenance / IGBT stabilizer"
                      error={errors.subject}
                      required
                      disabled={isSubmitting}
                    />

                    <Textarea
                      label="Your Message"
                      name="message"
                      id="contact-message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Please describe your equipment inquiry, site location, or service requirement..."
                      error={errors.message}
                      required
                      disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        leftIcon={<Send className="w-4 h-4" />}
                        className="w-full sm:w-auto font-semibold shadow-md"
                      >
                        {isSubmitting ? "Transmitting Message..." : "Transmit Message"}
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
