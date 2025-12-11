"use client";

import { useState, useEffect, useMemo } from "react";
import { TierCard, type Partner, type Tier } from "../components/tier-card";
import { CallToActionCard } from "../components/cta-card";
import partnerService from "@/app/services/partner";

const staticPartners: Partner[] = [
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

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await partnerService.getAll('sponsor');
        if (data && data.length > 0) {
            // Map backend data to component data
            const mappedPartners: Partner[] = data.map((p: any) => ({
            id: p._id,
            name: p.name,
            logo: p.logo,
            tier: (p.tier as Tier) || (p.description?.toLowerCase() as Tier) || 'bronze'
            }));
            setPartners(mappedPartners);
        } else {
            setPartners(staticPartners);
        }
      } catch (error) {
        console.error("Failed to fetch partners, using static data", error);
        setPartners(staticPartners);
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
