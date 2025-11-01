"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/app/components/button";
import { useMemo } from "react";

// --- Data and Types ---
type Tier = "platinum" | "gold" | "silver" | "bronze";

type Partner = {
  id: number;
  name: string;
  logo: string;
  tier: Tier;
};

const tierData: Record<
  Tier,
  { title: string; glowColor: string; logoSize: number }
> = {
  platinum: {
    title: "Platinum Sponsors",
    glowColor: "rgba(0, 167, 238, 0.7)",
    logoSize: 52,
  },
  gold: {
    title: "Gold Sponsors",
    glowColor: "rgba(250, 204, 21, 0.6)",
    logoSize: 48,
  },
  silver: {
    title: "Silver Sponsors",
    glowColor: "rgba(220, 220, 230, 0.6)",
    logoSize: 44,
  },
  bronze: {
    title: "Bronze Sponsors",
    glowColor: "rgba(217, 119, 6, 0.5)",
    logoSize: 40,
  },
};

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

// --- Glass Tier Card Component ---
const TierCard = ({ tier, partners }: { tier: Tier; partners: Partner[] }) => {
  const data = tierData[tier];
  const logoContainerSize = data.logoSize + 20;

  // Define gradient colors per tier
  const tierGradients: Record<Tier, string> = {
    platinum: "from-sky-200/30 via-sky-400/40 to-sky-600/30",
    gold: "from-amber-200/40 via-yellow-400/40 to-amber-600/30",
    silver: "from-gray-200/40 via-slate-400/40 to-gray-500/30",
    bronze: "from-orange-300/40 via-amber-500/40 to-orange-700/30",
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl backdrop-blur-xl border border-[var(--primary3)]/20 shadow-lg bg-gradient-to-br ${tierGradients[tier]}`}
    >
      {/* Gentle radial glow */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background: `radial-gradient(circle farthest-corner at 0% 0%, ${data.glowColor} 0%, transparent 100%)`,
        }}
      />

      <div className="relative px-8 py-10">
        <h3
          className="font-rubik font-bold text-left text-2xl mb-8"
          style={{
            color:
              tier === "platinum"
                ? "#0c4a6e" // darkest bluish
                : tier === "gold"
                ? "#78350f" // darkest gold/amber
                : tier === "silver"
                ? "#4b5563" // darkest gray
                : "#7c2d12", // darkest bronze/orange
          }}
        >
          {data.title}
        </h3>

        <div className="flex justify-start items-center -space-x-4 h-[120px] pl-2">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              className="group relative"
            >
              <div
                className={`flex items-center justify-center rounded-2xl p-2 shadow-md ring-2 transition-all duration-300 hover:ring-white/50 ${
                  tier === "silver"
                    ? "bg-gradient-to-br from-slate-400 via-gray-300 to-slate-400 ring-slate-400"
                    : "bg-white/80 ring-white/20"
                }`}
                style={{
                  width: `${logoContainerSize}px`,
                  height: `${logoContainerSize}px`,
                }}
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={data.logoSize}
                  height={data.logoSize}
                  className="object-contain"
                />
              </div>
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-lg bg-[var(--primary3)] px-3 py-1.5 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap font-raleway shadow-lg">
                {partner.name}
              </span>
            </motion.div>
          ))}
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
    <section className="dark-light-background relative overflow-hidden py-28 px-4 sm:px-6">
      <div className="relative z-10 mx-auto max-w-7xl">
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

        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-8">
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
      </div>
    </section>
  );
}
