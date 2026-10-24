"use client";

import { INPUT_CLASS } from "@/app/components/ui/form-styles";
import TextButton from "@/app/components/ui/text-button";
import { FormCardSkeleton } from "@/app/components/feedback/skeleton-cards";
import RemoveButton from "@/app/components/ui/remove-button";
import { useState, useEffect } from "react";
import Button from "@/app/components/ui/button";
import Dropdown from "@/app/components/ui/dropdown";
import { Check, Plus } from "lucide-react";
import siteService, { ContactDetails } from "@/app/services/site";
import { errorMessage } from "@/app/services/api-client";
import { DEFAULT_CONTACT } from "@/app/utils/site";
import { SOCIAL_PLATFORMS } from "@/app/utils/social-platforms";

const PLATFORM_OPTIONS = SOCIAL_PLATFORMS.map(({ id, label }) => ({ value: id, label }));
const MAX_LINKS = 12;

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
          socialLinks: settings.socialLinks ?? DEFAULT_CONTACT.socialLinks,
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

  const updateLink = (index: number, change: Partial<ContactDetails["socialLinks"][number]>) =>
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => (i === index ? { ...link, ...change } : link)),
    }));

  const removeLink = (index: number) =>
    setForm((prev) => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) }));

  const addLink = () =>
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "instagram", url: "" }],
    }));

  return (
    <div className="bg-white rounded-4xl border border-gray-200 shadow-md p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="font-rubik text-xl font-bold text-primary3">Contact Details</h2>
        <p className="mt-1 font-raleway text-sm text-gray-400">
          Shown in the footer and on the contact page. Event reports are also sent to the official email.
        </p>
      </div>

      {loading ? (
        <FormCardSkeleton />
      ) : (
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold font-raleway text-gray-700 ml-1">
                Official Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                placeholder={DEFAULT_CONTACT.contactEmail}
                className={INPUT_CLASS}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold font-raleway text-gray-700 ml-1">
                Secondary Email <span className="font-normal text-gray-400">(Optional, any provider such as Gmail)</span>
              </label>
              <input
                type="email"
                value={form.secondaryEmail}
                onChange={(e) => setForm((prev) => ({ ...prev, secondaryEmail: e.target.value }))}
                placeholder="name@gmail.com"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-rubik text-base font-bold text-primary3">Social media</h3>
              <p className="font-raleway text-xs text-gray-400">Optional. Add as many links as you need.</p>
            </div>

            {form.socialLinks.map((link, index) => (
              <div key={index} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Dropdown
                  variant="field"
                  value={link.platform}
                  options={PLATFORM_OPTIONS}
                  onChange={(platform) => updateLink(index, { platform })}
                  className="sm:w-48 sm:shrink-0"
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(index, { url: e.target.value })}
                  placeholder="https://"
                  className={INPUT_CLASS}
                />
                <RemoveButton onClick={() => removeLink(index)} />
              </div>
            ))}

            {form.socialLinks.length < MAX_LINKS && (
              <button
                type="button"
                onClick={addLink}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-gray-300 px-5 py-2 font-raleway text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-primary1 hover:bg-buttonbg1 hover:text-primary1"
              >
                <Plus size={16} /> Add a social link
              </button>
            )}
          </div>

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
              <TextButton onClick={() => save(DEFAULT_CONTACT, "Back to the defaults.")} disabled={saving}>
                Reset to defaults
              </TextButton>
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
