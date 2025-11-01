"use client";

import { useMemo } from "react";
import { TierCard, type Partner, type Tier } from "../components/tier-card";

const partners: Partner[] = [
  {
    id: 9,
    name: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    tier: "platinum",
  },
  {
    id: 1,
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    tier: "gold",
  },
  {
    id: 3,
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    tier: "gold",
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    tier: "silver",
  },
  {
    id: 8,
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    tier: "silver",
  },
  {
    id: 4,
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    tier: "bronze",
  },
  {
    id: 10,
    name: "Oracle",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
    tier: "bronze",
  },
];

// --- Call to Action Card Component ---
const CallToActionCard = () => {
  return (
    <div
      // Updated border to be consistent with TierCards
      className={`relative w-full h-full overflow-hidden rounded-3xl backdrop-blur-xl border border-[var(--primary3)]/20 shadow-lg bg-gradient-to-br from-[#003599]/40 via-[#003599]/60 to-[#003599]/50 flex flex-col p-8`}
    >
      {/* Gentle radial glow */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(circle farthest-corner at 0% 0%, rgba(0, 53, 153, 0.7) 0%, transparent 100%)`,
        }}
      />
      <div className="relative flex flex-col h-full">
        {/* Updated text colors for contrast */}
        <h3 className="font-rubik font-bold text-2xl mb-4 text-white">
          Become a Partner
        </h3>
        <p className="font-raleway text-slate-200 mb-6">
          Join our mission and showcase your brand to a passionate community.
        </p>
        <div className="mt-auto flex flex-col gap-4">
          <a
            href="/contact"
            // Added font-raleway and adjusted styles for the new background
            className="font-raleway cursor-pointer text-center bg-white/90 text-[#003599] font-bold py-3 px-6 rounded-xl shadow-md transition-transform hover:scale-105"
          >
            Sponsor Us
          </a>
          <a
            href="/primer.pdf"
            download
            // Added font-raleway and adjusted styles for the new background
            className="font-raleway cursor-pointer text-center bg-transparent text-white border border-white/80 font-bold py-3 px-6 rounded-xl shadow-md transition-transform hover:scale-105 hover:bg-white/10"
          >
            Download Primer
          </a>
        </div>
      </div>
    </div>
  );
};

export function PartnersSection() {
  const groupedPartners = useMemo(
    () =>
      partners.reduce((acc, partner) => {
        const tier = partner.tier;
        if (!acc[tier]) acc[tier] = [];
        acc[tier].push(partner);
        return acc;
      }, {} as Record<Tier, Partner[]>),
    []
  );

  const tierOrder: Tier[] = ["platinum", "gold", "silver", "bronze"];

  return (
    <section className="dark-light-background relative overflow-hidden py-32 px-4 sm:px-6">
      <div className="mt-8 relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 text-center mb-12 sm:flex-row sm:text-left">
          <div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight">
              Our Partners
            </h1>
            <p className="font-raleway text-base sm:text-lg text-bodytext mt-2 max-w-lg">
              Powering collaboration for growth and innovation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-8">
          {/* Tier Cards */}
          <div className="lg:col-span-2 lg:row-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {tierOrder.map(
              (tier) =>
                groupedPartners[tier] && (
                  <TierCard
                    key={tier}
                    tier={tier}
                    partners={groupedPartners[tier]}
                  />
                )
            )}
          </div>

          {/* CTA Card - Spans 2 rows on lg screens */}
          <div className="lg:row-span-2">
            <CallToActionCard />
          </div>
        </div>
      </div>
    </section>
  );
}