"use client";

import { useMemo } from "react";
import { TierCard, type Partner, type Tier } from "../tier-card";
import { CallToActionCard } from "../cta-card";
import sponsorService from "../../../services/sponsor";
import { SkeletonGate } from "@/app/components/feedback/skeleton";
import { useCachedFetch } from "@/app/hooks/use-cached-fetch";

const tierOrder: Tier[] = ["platinum", "gold", "silver", "bronze"];

const fetchPartners = async (): Promise<Partner[]> => {
  const response = await sponsorService.getSponsors();
  return (response.data || []).map((sponsor) => {
    const typeLower = sponsor.type ? sponsor.type.toLowerCase() : "";
    const tier: Tier =
      tierOrder.find((candidate) => typeLower.includes(candidate)) ?? "bronze";
    return {
      id: sponsor._id,
      name: sponsor.name,
      logo: sponsor.image || "",
      tier,
    };
  });
};

export function PartnersSection() {
  const { data, loading } = useCachedFetch("home-partners", fetchPartners);

  const visibleTiers = useMemo(() => {
    if (loading) return { tiers: tierOrder.slice(0, 2), grouped: {} as Record<Tier, Partner[]> };
    const grouped = (data ?? []).reduce(
      (acc, partner) => {
        (acc[partner.tier] ||= []).push(partner);
        return acc;
      },
      {} as Record<Tier, Partner[]>,
    );
    return { tiers: tierOrder.filter((tier) => grouped[tier]?.length), grouped };
  }, [data, loading]);

  const { tiers, grouped } = visibleTiers;
  const hasPartners = loading || tiers.length > 0;

  return (
    <section className="dark-light-background relative overflow-hidden py-32 px-4 sm:px-6">
      <div className="mt-8 relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 text-center mb-12 sm:flex-row sm:text-left">
          <div>
            <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight">
              Our Partners
            </h2>
            <p className="font-raleway text-base sm:text-lg text-bodytext mt-2 max-w-lg">
              Powering collaboration for growth and innovation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {hasPartners ? (
              <SkeletonGate loading={loading}>
                <div className="grid h-full grid-cols-1 sm:grid-cols-2 auto-rows-fr gap-8">
                  {tiers.map((tier, index) => (
                    <div
                      key={tier}
                      className={`flex ${
                        tiers.length % 2 === 1 && index === tiers.length - 1
                          ? "sm:col-span-2"
                          : ""
                      }`}
                    >
                      <TierCard
                        tier={tier}
                        partners={grouped[tier] || []}
                        loading={loading}
                      />
                    </div>
                  ))}
                </div>
              </SkeletonGate>
            ) : (
              <div className="flex h-full min-h-60 items-center justify-center rounded-3xl border border-(--primary3)/20 bg-white/60 px-8 py-12 text-center shadow-md">
                <div>
                  <h3 className="font-rubik text-2xl font-bold text-primary3">
                    Partners coming soon
                  </h3>
                  <p className="mx-auto mt-2 max-w-md font-raleway text-bodytext">
                    We&apos;re lining up sponsors and collaborators for the
                    chapter. Interested in joining them?
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <CallToActionCard />
          </div>
        </div>
      </div>
    </section>
  );
}
