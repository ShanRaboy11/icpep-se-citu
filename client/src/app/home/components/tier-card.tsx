"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export type Tier = "platinum" | "gold" | "silver" | "bronze";

export type Partner = {
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
    logoSize: 68,
  },
  gold: {
    title: "Gold Sponsors",
    glowColor: "rgba(250, 204, 21, 0.6)",
    logoSize: 52,
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

export const TierCard = ({
  tier,
  partners,
}: {
  tier: Tier;
  partners: Partner[];
}) => {
  const data = tierData[tier];
  const logoContainerSize = data.logoSize + 20;

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

        <div className="flex justify-start items-center space-x-4 h-[120px] pl-2">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              className="group relative"
            >
              <div
                className="flex items-center justify-center rounded-2xl p-2 shadow-md ring-2 transition-all duration-300 hover:ring-white/50 bg-white/80 ring-white/20"
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
              <span
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 rounded-lg px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap font-raleway shadow-lg"
                style={{
                  background:
                    tier === "platinum"
                      ? "#0c4a6e"
                      : tier === "gold"
                      ? "#78350f"
                      : tier === "silver"
                      ? "#4b5563"
                      : "#7c2d12",
                }}
              >
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
