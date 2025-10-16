"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/app/components/button";

type Tier = "gold" | "silver" | "bronze";

const tierStyles: Record<Tier, { border: string; glow: string; size: number }> =
  {
    gold: {
      border: "border-yellow-400",
      glow: "shadow-[0_0_20px_rgba(255,215,0,0.3)]",
      size: 110,
    },
    silver: {
      border: "border-gray-400",
      glow: "shadow-[0_0_20px_rgba(200,200,200,0.3)]",
      size: 95,
    },
    bronze: {
      border: "border-amber-600",
      glow: "shadow-[0_0_20px_rgba(205,127,50,0.3)]",
      size: 85,
    },
  };
const partners = [
  {
    id: 1,
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    tier: "gold",
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    tier: "silver",
  },
  {
    id: 3,
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    tier: "gold",
  },
  {
    id: 4,
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    tier: "bronze",
  },
  {
    id: 5,
    name: "Intel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg",
    tier: "silver",
  },
  {
    id: 6,
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Adobe_Systems_logo_and_wordmark.svg",
    tier: "bronze",
  },
  {
    id: 7,
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Meta_Platforms_Inc._logo.svg",
    tier: "gold",
  },
  {
    id: 8,
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    tier: "silver",
  },
];

export function PartnersSection() {
  return (
    <section
      className="w-full py-24 px-6 flex flex-col items-center text-center sm:mb-10"
      style={{ backgroundColor: "#FEFEFF" }}
    >
      <div className="max-w-2xl mx-auto mb-20">
        <h2 className="font-rubik text-3xl sm:text-5xl font-bold text-gray-900">
          Our Partners
        </h2>
        <p className="font-raleway text-gray-600 mt-3 text-sm md:text-base">
          Building meaningful collaborations that make an impact on students and
          the community.
        </p>
      </div>

      {/* Partner Logos */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 mb-12">
        {partners.map((partner, index) => {
          const tier = tierStyles[partner.tier as Tier];
          const delay = index * 0.3; // slight stagger effect

          return (
            <motion.div
              key={partner.id}
              className="flex flex-col items-center group"
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                delay,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`flex items-center justify-center rounded-full bg-white border ${tier.border} ${tier.glow} transition-transform duration-300`}
                style={{
                  width: `${tier.size}px`,
                  height: `${tier.size}px`,
                }}
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={tier.size * 0.45}
                  height={tier.size * 0.45}
                  className="object-contain"
                />
              </motion.div>

              <motion.span className="text-gray-700 mt-3 text-sm md:text-base font-medium opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform translate-y-2 transition-all duration-300">
                {partner.name}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      <Button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 text-sm md:text-base rounded-full">
        Explore Partnership
      </Button>
    </section>
  );
}
