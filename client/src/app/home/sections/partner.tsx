"use client";

import { useMemo, useState, useEffect } from "react";
import { TierCard, type Partner, type Tier } from "../components/tier-card";
import { CallToActionCard } from "../components/cta-card";
import sponsorService from "../../services/sponsor";
const primerFile = "/primer.pdf";

// Shimmer animation style
const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -800px 0; }
    100% { background-position: 800px 0; }
  }
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 0px,
      rgba(255,255,255,0.10) 40px,
      rgba(255,255,255,0.04) 80px
    );
    background-size: 800px 100%;
    animation: shimmer 1.6s infinite linear;
  }
`;

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer rounded-lg bg-white/5 ${className}`} />
  );
}

// Mirrors a TierCard: header badge + tier label, then a grid of logo placeholders
function TierCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex flex-col gap-5">
      {/* Tier badge row */}
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-5 h-5 rounded-sm flex-shrink-0" />
        <SkeletonBlock className="w-24 h-5 rounded-full" />
      </div>

      {/* Partner logo grid — 2 cols × 2 rows */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 flex items-center justify-center p-4 aspect-video"
          >
            <SkeletonBlock className="w-3/4 h-6 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Mirrors the CallToActionCard: decorative icon, heading, body text, two buttons
function CTACardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 flex flex-col gap-6 h-full">
      {/* Icon / illustration placeholder */}
      <SkeletonBlock className="w-16 h-16 rounded-2xl self-center" />

      {/* Heading */}
      <div className="flex flex-col items-center gap-3">
        <SkeletonBlock className="w-40 h-6 rounded-md" />
        <SkeletonBlock className="w-52 h-6 rounded-md" />
      </div>

      {/* Body text lines */}
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="w-full h-4 rounded-md" />
        <SkeletonBlock className="w-full h-4 rounded-md" />
        <SkeletonBlock className="w-4/5 h-4 rounded-md" />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 mt-auto">
        <SkeletonBlock className="w-full h-11 rounded-full" />
        <SkeletonBlock className="w-full h-11 rounded-full" />
      </div>
    </div>
  );
}

function PartnersSkeleton() {
  return (
    <section className="dark-light-background relative overflow-hidden py-32 px-4 sm:px-6">
      <style>{shimmerStyle}</style>
      <div className="mt-8 relative z-10 mx-auto max-w-7xl">
        {/* Header skeleton */}
        <div className="flex flex-col items-center justify-between gap-4 text-center mb-12 sm:flex-row sm:text-left">
          <div className="flex flex-col gap-3">
            <SkeletonBlock className="w-52 h-10 rounded-md" />
            <SkeletonBlock className="w-72 h-5 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-8">
          {/* Tier card skeletons — 2×2 grid */}
          <div className="lg:col-span-2 lg:row-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <TierCardSkeleton />
            <TierCardSkeleton />
            <TierCardSkeleton />
            <TierCardSkeleton />
          </div>

          {/* CTA card skeleton */}
          <div className="lg:row-span-2">
            <CTACardSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
}

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await sponsorService.getSponsors();
        const sponsorsData = response.data || [];

        const mappedPartners: Partner[] = sponsorsData.map((sponsor: any) => {
          let tier: Tier = "bronze";
          const typeLower = sponsor.type ? sponsor.type.toLowerCase() : "";

          if (typeLower.includes("platinum")) tier = "platinum";
          else if (typeLower.includes("gold")) tier = "gold";
          else if (typeLower.includes("silver")) tier = "silver";
          else if (typeLower.includes("bronze")) tier = "bronze";

          return {
            id: sponsor._id,
            name: sponsor.name,
            logo: sponsor.image || "",
            tier: tier,
          };
        });

        setPartners(mappedPartners);
      } catch (error) {
        console.error("Failed to fetch sponsors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const groupedPartners = useMemo(
    () =>
      partners.reduce(
        (acc, partner) => {
          const tier = partner.tier;
          if (!acc[tier]) acc[tier] = [];
          acc[tier].push(partner);
          return acc;
        },
        {} as Record<Tier, Partner[]>,
      ),
    [partners],
  );

  const tierOrder: Tier[] = ["platinum", "gold", "silver", "bronze"];

  const handleDownloadPrimer = () => {
    const link = document.createElement("a");
    link.href = primerFile;
    link.download = "primer.pdf";
    link.click();
  };

  if (loading) {
    return <PartnersSkeleton />;
  }

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
            {tierOrder.map((tier) => (
              <TierCard
                key={tier}
                tier={tier}
                partners={groupedPartners[tier] || []}
              />
            ))}
          </div>

          {/* CTA Card */}
          <div className="lg:row-span-2">
            <CallToActionCard />
          </div>
        </div>
      </div>
    </section>
  );
}
