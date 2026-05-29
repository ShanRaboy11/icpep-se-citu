"use client";

import { useMemo, useState, useEffect } from "react";
import { TierCard, type Partner, type Tier } from "../components/tier-card";
import { CallToActionCard } from "../components/cta-card";
import sponsorService from "../../services/sponsor";

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
          <div className="lg:col-span-2 lg:row-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {tierOrder.map((tier) => (
              <TierCard
                key={tier}
                tier={tier}
                partners={groupedPartners[tier] || []}
                loading={loading}
              />
            ))}
          </div>

          <div className="lg:row-span-2">
            <CallToActionCard />
          </div>
        </div>
      </div>
    </section>
  );
}
