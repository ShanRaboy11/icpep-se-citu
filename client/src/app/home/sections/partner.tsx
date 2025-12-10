"use client";

import { useState, useEffect, useMemo } from "react";
import { TierCard, type Partner, type Tier } from "../components/tier-card";
import { CallToActionCard } from "../components/cta-card";
import partnerService from "@/app/services/partner";

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await partnerService.getAll('sponsor');
        // Map backend data to component data
        const mappedPartners: Partner[] = data.map((p: any) => ({
          id: p._id,
          name: p.name,
          logo: p.logo,
          tier: (p.description?.toLowerCase() as Tier) || 'bronze'
        }));
        setPartners(mappedPartners);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const groupedPartners = useMemo(
    () =>
      partners.reduce((acc, partner) => {
        const tier = partner.tier;
        if (!acc[tier]) acc[tier] = [];
        acc[tier].push(partner);
        return acc;
      }, {} as Record<Tier, Partner[]>),
    [partners]
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
            {isLoading ? (
               <div className="col-span-2 flex justify-center py-12">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary1"></div>
               </div>
            ) : partners.length === 0 ? (
               <div className="col-span-2 text-center py-12 text-gray-500">
                 No partners found.
               </div>
            ) : (
              tierOrder.map(
                (tier) =>
                  groupedPartners[tier] && (
                    <TierCard
                      key={tier}
                      tier={tier}
                      partners={groupedPartners[tier]}
                    />
                  )
              )
            )}
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
