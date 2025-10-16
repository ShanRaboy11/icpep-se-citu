"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Button from "@/app/components/button";

const tierStyles = {
  gold: {
    border: "border-yellow-400",
    glow: "shadow-[0_0_20px_rgba(255,215,0,0.1)]",
    size: 110,
  },
  silver: {
    border: "border-gray-300",
    glow: "shadow-[0_0_20px_rgba(200,200,200,0.1)]",
    size: 95,
  },
  bronze: {
    border: "border-amber-700",
    glow: "shadow-[0_0_20px_rgba(205,127,50,0.1)]",
    size: 85,
  },
} as const;

// Define the tier type
type TierType = keyof typeof tierStyles;

export function PartnersSection() {
  const partners: Array<{ id: number; name: string; logo: string; tier: TierType }> = [
    { id: 1, name: "Google", logo: "/icpep logo.png", tier: "gold" },
    { id: 2, name: "Microsoft", logo: "/icpep logo.png", tier: "silver" },
    { id: 3, name: "Amazon", logo: "/icpep logo.png", tier: "gold" },
    { id: 4, name: "IBM", logo: "/icpep logo.png", tier: "bronze" },
    { id: 5, name: "Intel", logo: "/icpep logo.png", tier: "silver" },
    { id: 6, name: "Adobe", logo: "/icpep logo.png", tier: "bronze" },
    { id: 7, name: "Meta", logo: "/icpep logo.png", tier: "gold" },
    { id: 8, name: "Apple", logo: "/icpep logo.png", tier: "silver" },
  ];

  return (
    <section className="w-full py-24 px-6 flex flex-col items-center text-center sm:mb-60">
      <div className="max-w-2xl mx-auto mb-20">
        <h2 className="font-rubik text-3xl md:text-4xl font-bold text-gray-900">
          Our Partners
        </h2>
        <p className="font-raleway text-gray-600 mt-3 text-sm md:text-base">
          Building meaningful collaborations that make an impact on students
          and the community.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 mb-12">
        {partners.map((partner, index) => {
          const tier = tierStyles[partner.tier];
          const delay = index * 0.3;

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
              <div
                className={`flex items-center justify-center rounded-full bg-white border ${tier.border} ${tier.glow} transition-transform duration-300 group-hover:scale-110`}
                style={{
                  width: `${tier.size}px`,
                  height: `${tier.size}px`,
                }}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={tier.size * 0.45}
                  height={tier.size * 0.45}
                  className="object-contain"
                />
              </div>

              <motion.span className="text-gray-700 mt-3 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform translate-y-2 transition-all duration-300">
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