"use client";

import { FormCardSkeleton } from "@/app/components/skeleton-cards";
import React, { useRef, useState, useEffect } from "react";
import Button from "@/app/components/button";
import { Check, ExternalLink, FileText, Upload } from "lucide-react";
import siteService from "@/app/services/site";
import { errorMessage } from "@/app/services/api-client";

const DEFAULT_PRIMER = "/documents/primer.pdf";
const MAX_PDF_MB = 10;

export default function PrimerCard() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [primerUrl, setPrimerUrl] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    siteService
      .getSettings()
      .then((settings) => setPrimerUrl(settings.primerUrl || ""))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const save = async (input: { file?: File; url?: string; clear?: boolean }, success: string) => {
    setSaving(true);
    setNotice(null);
    try {
      setPrimerUrl(await siteService.updatePrimer(input));
      setLink("");
      setNotice({ text: success, ok: true });
    } catch (error) {
      setNotice({ text: errorMessage(error, "Could not update the primer."), ok: false });
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setNotice({ text: "Please choose a PDF file.", ok: false });
      return;
    }
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      setNotice({
        text: `The PDF must be ${MAX_PDF_MB}MB or smaller. Compress it, or paste a link instead.`,
        ok: false,
      });
      return;
    }
    save({ file }, "Primer uploaded.");
  };

  const activeUrl = primerUrl || DEFAULT_PRIMER;

  return (
    <div className="bg-white rounded-4xl border border-gray-200 shadow-lg p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="font-rubik text-xl font-bold text-primary3">Sponsorship Primer</h2>
        <p className="mt-1 font-raleway text-sm text-gray-400">
          What the &ldquo;Download Primer&rdquo; button on the home page&apos;s partners section opens.
        </p>
      </div>

      {loading ? (
        <FormCardSkeleton />
      ) : (
        <div className="space-y-8">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary1/10 text-primary1">
              <FileText size={22} />
            </div>
            <div className="min-w-0 grow">
              <p className="font-rubik text-sm font-bold text-gray-800">
                {primerUrl ? "Custom primer" : "Default primer"}
              </p>
              <p className="truncate font-raleway text-xs text-gray-500">{activeUrl}</p>
            </div>
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-raleway text-sm font-semibold text-primary1 hover:underline"
            >
              Open <ExternalLink size={14} />
            </a>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold font-raleway text-gray-700 ml-1">Upload a PDF</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFile}
            />
            <Button
              variant="heroOutline"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className="inline-flex items-center gap-2 whitespace-nowrap px-5 py-2 sm:px-6 sm:py-3"
            >
              <Upload size={16} /> Choose PDF
            </Button>
            <p className="text-xs text-gray-400 font-raleway ml-1">Up to {MAX_PDF_MB}MB.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold font-raleway text-gray-700 ml-1">Or use a link</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-rubik text-base text-gray-800 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10"
              />
              <Button
                variant="hero"
                onClick={() => save({ url: link }, "Primer link saved.")}
                disabled={!link.trim() || saving}
                className="whitespace-nowrap px-5 py-2 sm:px-8 sm:py-3"
              >
                Save Link
              </Button>
            </div>
            <p className="text-xs text-gray-400 font-raleway ml-1">
              Handy for large files. Share the PDF so anyone with the link can view it.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {notice ? (
              <p
                className={`flex items-center gap-1.5 text-xs font-bold font-raleway ${
                  notice.ok ? "text-green-600" : "text-red-500"
                }`}
              >
                {notice.ok && <Check size={14} />} {notice.text}
              </p>
            ) : (
              <span />
            )}
            {primerUrl && (
              <button
                type="button"
                onClick={() => save({ clear: true }, "Primer reset to the default.")}
                className="cursor-pointer font-raleway text-sm font-semibold text-gray-500 hover:text-red-500 hover:underline"
              >
                Reset to default
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
