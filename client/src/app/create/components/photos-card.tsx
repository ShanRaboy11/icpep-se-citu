"use client";

import { FormCardSkeleton } from "@/app/components/skeleton-cards";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import RemoveButton from "@/app/components/remove-button";
import siteService, { PhotoSection } from "@/app/services/site";
import { errorMessage } from "@/app/services/api-client";
import { DEFAULT_ABOUT_PHOTOS, DEFAULT_JOIN_PHOTOS, resolvePhotos } from "@/app/utils/site-photos";

const MAX_IMAGE_MB = 5;

const SECTIONS: { id: PhotoSection; title: string; description: string; defaults: string[] }[] = [
  {
    id: "join",
    title: "Why Join ICpEP SE?",
    description: "The photo stack beside the benefits on the home page.",
    defaults: DEFAULT_JOIN_PHOTOS,
  },
  {
    id: "about",
    title: "Engineered for Impact",
    description: "The rotating cube on the About page.",
    defaults: DEFAULT_ABOUT_PHOTOS,
  },
];

function PhotoSlot({
  url,
  isDefault,
  busy,
  onReplace,
  onReset,
}: {
  url: string;
  isDefault: boolean;
  busy: boolean;
  onReplace: (file: File) => void;
  onReset: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="relative group aspect-square overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50">
      <Image src={url} alt="" fill sizes="(min-width: 640px) 20vw, 45vw" className="object-cover" />

      {isDefault && (
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2.5 py-1 font-raleway text-[10px] font-semibold text-white">
          Default
        </span>
      )}

      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2 bg-black/30 p-2 opacity-100 transition-all duration-300 sm:bg-black/0 sm:opacity-0 sm:group-hover:bg-black/30 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="cursor-pointer rounded-full bg-white px-4 py-2 font-rubik text-xs font-bold text-primary3 shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Replace
        </button>
        {!isDefault && <RemoveButton variant="overlay" onClick={onReset} disabled={busy} />}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onReplace(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function PhotosCard() {
  const [photos, setPhotos] = useState<Record<PhotoSection, string[]>>({ join: [], about: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    siteService
      .getSettings()
      .then((settings) => setPhotos({ join: settings.joinPhotos ?? [], about: settings.aboutPhotos ?? [] }))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const run = async (section: PhotoSection, task: () => Promise<string[]>, success: string) => {
    setBusy(true);
    setNotice(null);
    try {
      const next = await task();
      setPhotos((prev) => ({ ...prev, [section]: next }));
      setNotice({ text: success, ok: true });
    } catch (error) {
      setNotice({ text: errorMessage(error, "Could not update the photo."), ok: false });
    } finally {
      setBusy(false);
    }
  };

  const replace = (section: PhotoSection, slot: number, file: File) => {
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setNotice({ text: `Photos must be ${MAX_IMAGE_MB}MB or smaller.`, ok: false });
      return;
    }
    run(section, () => siteService.setPhoto(section, slot, file), "Photo updated.");
  };

  return (
    <div className="bg-white rounded-4xl border border-gray-200 shadow-lg p-6 sm:p-10">
      <div className="mb-8">
        <h2 className="font-rubik text-xl font-bold text-primary3">Section Photos</h2>
        <p className="mt-1 font-raleway text-sm text-gray-400">
          Replace the photos in these sections. Removing one puts the built-in photo back, so there&apos;s
          never an empty spot. The text stays as it is.
        </p>
      </div>

      {loading ? (
        <FormCardSkeleton />
      ) : (
        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.id} className="space-y-4">
              <div>
                <h3 className="font-rubik text-base font-bold text-primary3">{section.title}</h3>
                <p className="font-raleway text-xs text-gray-400">{section.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {resolvePhotos(photos[section.id], section.defaults).map((url, slot) => {
                  const isDefault = url === section.defaults[slot];
                  return (
                    <PhotoSlot
                      key={slot}
                      url={url}
                      isDefault={isDefault}
                      busy={busy}
                      onReplace={(file) => replace(section.id, slot, file)}
                      onReset={() =>
                        run(section.id, () => siteService.clearPhoto(section.id, slot), "Photo removed.")
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {notice && (
            <p
              className={`flex items-center gap-1.5 text-xs font-bold font-raleway ${
                notice.ok ? "text-green-600" : "text-red-500"
              }`}
            >
              {notice.ok && <Check size={14} />} {notice.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
