"use client";

import React, { useState, useEffect } from "react";
import Button from "@/app/components/button";
import { LoadingIndicator } from "@/app/components/loading";
import { Check } from "lucide-react";
import siteService, { ContactDetails } from "@/app/services/site";
import { errorMessage } from "@/app/services/api-client";
import { DEFAULT_CONTACT } from "@/app/utils/site";

const FIELD_STYLE =
  "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-rubik text-base text-gray-800 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10";

const EMAILS: { key: keyof ContactDetails; label: string; optional?: boolean }[] = [
  { key: "contactEmail", label: "Official Email" },
  { key: "secondaryEmail", label: "Secondary Email", optional: true },
];

const SOCIALS: { key: keyof ContactDetails; label: string; optional?: boolean }[] = [
  { key: "facebookUrl", label: "Facebook Page" },
  { key: "tiktokUrl", label: "TikTok Account" },
  { key: "instagramUrl", label: "Instagram", optional: true },
  { key: "xUrl", label: "X (Twitter)", optional: true },
  { key: "youtubeUrl", label: "YouTube", optional: true },
  { key: "linkedinUrl", label: "LinkedIn", optional: true },
];

const BLANK: ContactDetails = {
  contactEmail: "",
  secondaryEmail: "",
  facebookUrl: "",
  tiktokUrl: "",
  instagramUrl: "",
  xUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
};

export default function ContactCard() {
  const [form, setForm] = useState<ContactDetails>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    siteService
      .getSettings()
      .then((settings) =>
        setForm({
          contactEmail: settings.contactEmail || DEFAULT_CONTACT.contactEmail,
          secondaryEmail: settings.secondaryEmail || "",
          facebookUrl: settings.facebookUrl || DEFAULT_CONTACT.facebookUrl,
          tiktokUrl: settings.tiktokUrl || DEFAULT_CONTACT.tiktokUrl,
          instagramUrl: settings.instagramUrl || "",
          xUrl: settings.xUrl || "",
          youtubeUrl: settings.youtubeUrl || "",
          linkedinUrl: settings.linkedinUrl || "",
        }),
      )
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const save = async (values: ContactDetails, success: string) => {
    setSaving(true);
    setNotice(null);
    try {
      setForm(await siteService.updateContact(values));
      setNotice({ text: success, ok: true });
    } catch (error) {
      setNotice({ text: errorMessage(error, "Could not save the contact details."), ok: false });
    } finally {
      setSaving(false);
    }
  };

  const change = (field: keyof ContactDetails) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const renderField = ({ key, label, optional }: { key: keyof ContactDetails; label: string; optional?: boolean }) => (
    <div key={key} className="space-y-2">
      <label className="block text-sm font-bold font-raleway text-gray-700 ml-1">
        {label} {optional && <span className="font-normal text-gray-400">(Optional)</span>}
      </label>
      <input
        type={EMAILS.some((email) => email.key === key) ? "email" : "text"}
        value={form[key]}
        onChange={change(key)}
        placeholder={DEFAULT_CONTACT[key] || (key.endsWith("Email") ? "name@cit.edu" : "https://")}
        className={FIELD_STYLE}
      />
    </div>
  );

  return (
    <div className="bg-white rounded-4xl border border-gray-200 shadow-lg p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="font-rubik text-xl font-bold text-primary3">Contact Details</h2>
        <p className="mt-1 font-raleway text-sm text-gray-400">
          Shown in the footer and on the contact page. Event reports are also sent to the official email.
          Optional fields only appear on the site once filled in.
        </p>
      </div>

      {loading ? (
        <div className="py-10">
          <LoadingIndicator label="Loading..." />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-6">{EMAILS.map(renderField)}</div>
          <div className="space-y-6">{SOCIALS.map(renderField)}</div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {notice ? (
              <p
                className={`flex items-center gap-1.5 text-xs font-bold font-raleway ${
                  notice.ok ? "text-green-600" : "text-red-500"
                }`}
              >
                {notice.ok && <Check size={14} />} {notice.text}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => save(BLANK, "Back to the defaults.")}
                disabled={saving}
                className="cursor-pointer font-raleway text-sm font-semibold text-gray-500 hover:text-red-500 hover:underline"
              >
                Reset to defaults
              </button>
            )}
            <Button
              variant="hero"
              onClick={() => save(form, "Contact details saved.")}
              disabled={saving}
              className="whitespace-nowrap px-5 py-2 sm:px-8 sm:py-3"
            >
              Save Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
