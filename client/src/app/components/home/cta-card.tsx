"use client";

import siteService from "@/app/services/site";
import { useCachedFetch } from "@/app/hooks/use-cached-fetch";

export const CallToActionCard = () => {
  const { data: settings } = useCachedFetch("site-settings", () => siteService.getSettings());
  const primerUrl = settings?.primerUrl || "/documents/primer.pdf";

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-3xl backdrop-blur-xl border border-(--primary3)/20 shadow-md bg-linear-to-br from-primary3/40 via-primary3/60 to-primary3/50 flex flex-col p-8`}
    >

      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(circle farthest-corner at 0% 0%, rgba(0, 53, 153, 0.7) 0%, transparent 100%)`,
        }}
      />
      <div className="relative flex flex-col h-full">
        <h3 className="font-rubik font-bold text-2xl mb-4 text-white">
          Become a Partner
        </h3>
        <p className="font-raleway text-slate-200 mb-6">
          Join our mission and showcase your brand to a passionate community.
        </p>
        <div className="mt-auto flex flex-col gap-4">
          <a
            href="/contact"
            className="font-raleway cursor-pointer text-center bg-white/90 text-primary3 font-bold py-3 px-6 rounded-xl shadow-md transition-all hover:scale-105"
          >
            Sponsor Us
          </a>
          <a
            href={primerUrl}
            download="Sponsorship_Primer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-raleway cursor-pointer text-center bg-transparent text-white border border-white/80 font-bold py-3 px-6 rounded-xl shadow-md transition-all hover:scale-105 hover:bg-white/10"
          >
            Download Primer
          </a>
        </div>
      </div>
    </div>
  );
};
