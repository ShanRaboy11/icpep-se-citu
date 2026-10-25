"use client";

import { emailMeta } from "@/app/utils/social-platforms";
import { FormEvent, useId, useState } from "react";
import {
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { platformMeta } from "@/app/utils/social-platforms";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Grid from "../components/layout/grid";
import BackButton from "../components/ui/back-button";
import PageHeader from "../components/ui/page-header";
import Button from "../components/ui/button";
import { useSiteContact } from "@/app/hooks/use-site-contact";
import Dropdown from "@/app/components/ui/dropdown";

const SUBJECT_OPTIONS = [
  "Membership Inquiry",
  "Event Inquiry",
  "Partnership / Sponsorship",
  "General Question",
  "Others, specify:",
];
const OTHER_SUBJECT = "Others, specify:";

// Disabling native validation (see `noValidate` below) means format
// checking — not just "is it filled in" — has to be done by hand too.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputStyle =
  "mt-2 w-full font-rubik font-normal bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-400 placeholder:font-normal focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 text-gray-800";

const labelStyle = "block font-raleway text-sm font-bold text-gray-700";


function Field({
  label,
  name,
  type = "text",
  placeholder,
  textarea = false,
  rows,
  required = true,
  error = false,
  errorMessage,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  onChange?: () => void;
}) {
  const id = useId();
  const errorCls = error ? "border-red-300 ring-2 ring-red-100" : "";
  return (
    <div>
      <label htmlFor={id} className={labelStyle}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          onChange={onChange}
          className={`${inputStyle} resize-y ${errorCls}`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          className={`${inputStyle} ${errorCls}`}
        />
      )}
      {error && errorMessage && (
        <p className="mt-1.5 font-raleway text-xs text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

type FormErrors = {
  name: boolean;
  email: boolean;
  message: boolean;
  subject: boolean;
  customSubject: boolean;
};

export default function ContactPage() {
  const contact = useSiteContact();
  const router = useRouter();
  const phoneId = useId();
  const [subject, setSubject] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    email: false,
    message: false,
    subject: false,
    customSubject: false,
  });
  const [emailErrorMessage, setEmailErrorMessage] = useState(
    "Email is required",
  );
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [mailError, setMailError] = useState<string | null>(null);

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMailError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const customSubject = String(formData.get("customSubject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    setEmailErrorMessage(
      !email ? "Email is required" : "Please enter a valid email address",
    );

    const newErrors: FormErrors = {
      name: !name,
      email: !email || !EMAIL_REGEX.test(email),
      message: !message,
      subject: !subject,
      customSubject: subject === OTHER_SUBJECT && !customSubject,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      setShowGlobalError(true);

      // Draw attention to whichever invalid field comes first in the form,
      // top to bottom — not straight to Subject just because it happens to
      // have its own special "open the dropdown" behavior.
      const form = event.currentTarget;
      if (newErrors.name) {
        const el = form.querySelector<HTMLInputElement>('[name="name"]');
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.email) {
        const el = form.querySelector<HTMLInputElement>('[name="email"]');
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.subject) {
        form.querySelector("[data-dropdown] button")?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.customSubject) {
        const el = form.querySelector<HTMLInputElement>(
          '[name="customSubject"]',
        );
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.message) {
        const el = form.querySelector<HTMLTextAreaElement>(
          '[name="message"]',
        );
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setShowGlobalError(false);

    try {
      const finalSubject =
        subject === OTHER_SUBJECT ? customSubject : subject;

      const body = `Name: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\n\n${message}`;
      window.location.href = `mailto:${contact.contactEmail}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
    } catch {
      setMailError(
        `Something went wrong opening your mail app. You can reach us directly at ${contact.contactEmail}.`,
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-pageblue">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        {/* Background glow decoration — static, matching the convention used
            on other pages, since the previous animated/orbiting blur blobs
            escaped the rounded bottom corners on this page. */}
        <div className="absolute -top-40 -left-60 w-140 h-140 bg-primary1/10 rounded-full filter blur-3xl opacity-60" />
        <div className="absolute top-1/4 -right-72 w-140 h-140 bg-secondary2/10 rounded-full filter blur-3xl opacity-60" />

        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="w-full max-w-6xl mx-auto px-6 pt-38 pb-24 grow">
            <div className="mb-8 flex justify-start">
              <BackButton onClick={() => router.back()} title="Go Back" />
            </div>

            <PageHeader
              badge="Get in Touch"
              title="Contact Us"
              subtitleClassName="max-w-2xl"
              subtitle={
                <>
                  Have questions or any concerns about membership, events, or
                  partnerships — reach us online or send a message through the
                  form.
                </>
              }
            />

            <div className="mx-auto max-w-3xl overflow-hidden rounded-4xl border border-gray-200 bg-white shadow-md">
              <section className="p-8 md:p-10">
                <h2 className="font-rubik text-2xl font-bold text-primary3">
                  Send an inquiry
                </h2>
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-8 space-y-5"
                >
                  <Field
                    label="Name"
                    name="name"
                    placeholder="Juan Dela Cruz"
                    error={errors.name}
                    errorMessage="Name is required"
                    onChange={() => clearError("name")}
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="juandelacruz@gmail.com"
                    error={errors.email}
                    errorMessage={emailErrorMessage}
                    onChange={() => clearError("email")}
                  />
                  <div>
                    <label htmlFor={phoneId} className={labelStyle}>
                      Phone Number
                    </label>
                    <input
                      id={phoneId}
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                      }
                      placeholder="09171234567"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      variant="field"
                      className="mt-2"
                      value={subject}
                      placeholder="What's this all about?"
                      invalid={errors.subject}
                      options={SUBJECT_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
                      onChange={(value) => {
                        setSubject(value);
                        clearError("subject");
                      }}
                    />
                    {errors.subject && (
                      <p className="mt-1.5 font-raleway text-xs text-red-400">
                        Subject is required
                      </p>
                    )}

                    {/* Hidden field so the chosen subject rides along with the form */}
                    <input
                      type="hidden"
                      name="subject"
                      value={subject}
                      readOnly
                    />

                    {subject === OTHER_SUBJECT && (
                      <>
                        <input
                          name="customSubject"
                          placeholder="Type your subject here"
                          onChange={() => clearError("customSubject")}
                          className={`${inputStyle} ${
                            errors.customSubject
                              ? "border-red-300 ring-2 ring-red-100"
                              : ""
                          }`}
                          autoFocus
                        />
                        {errors.customSubject && (
                          <p className="mt-1.5 font-raleway text-xs text-red-400">
                            Please specify a subject
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <Field
                    label="Message"
                    name="message"
                    placeholder="Write your message here"
                    textarea
                    rows={6}
                    error={errors.message}
                    errorMessage="Message is required"
                    onChange={() => clearError("message")}
                  />

                  {(showGlobalError || mailError) && (
                    <p className="flex items-center gap-1.5 font-raleway text-xs font-medium text-red-400">
                      <AlertTriangle size={12} />{" "}
                      {mailError || "Please fill all required fields"}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="hero"
                    className="group flex w-full items-center justify-center gap-2 px-6 py-3.5"
                  >
                    <span>Submit</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </form>
              </section>

              <div className="border-t border-gray-100 bg-gray-50/70 px-8 py-8 md:px-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary1 font-raleway">
                      Stay Connected
                    </span>
                    <p className="mt-2 font-raleway text-sm text-gray-500 max-w-sm leading-relaxed">
                      Follow our official channels for announcements, events,
                      and updates. We typically respond within 1–2 business
                      days.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {[contact.contactEmail, contact.secondaryEmail].filter(Boolean).map((address) => {
                      const meta = emailMeta(address);
                      return (
                        <a
                          key={address}
                          href={`mailto:${address}`}
                          title={`${meta.label}: ${address}`}
                          className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary1/30 text-primary1 transition-all duration-300 hover:border-primary1 hover:bg-primary1 hover:text-white active:scale-95"
                        >
                          <meta.Icon className="h-5 w-5" aria-hidden="true" />
                        </a>
                      );
                    })}
                    {contact.socialLinks.map(({ platform, url }) => {
                      const meta = platformMeta(platform);
                      if (!meta) return null;
                      return (
                        <a
                          key={`${platform}-${url}`}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={meta.label}
                          className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary1/30 text-primary1 transition-all duration-300 hover:border-primary1 hover:bg-primary1 hover:text-white active:scale-95"
                        >
                          <meta.Icon className="h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
}
