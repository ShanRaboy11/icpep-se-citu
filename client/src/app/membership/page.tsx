"use client";

import { useEffect, useState, type FC } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import MembershipCard from "./components/membership-card";
import InteractiveCta from "./components/cta";
import PageHeader from "../components/page-header";
import membershipService, {
  MembershipTierData,
} from "../services/membership";

const MembershipPage: FC = () => {
  const [tiers, setTiers] = useState<MembershipTierData[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [tiersRes, settingsRes] = await Promise.all([
          membershipService.getTiers(),
          membershipService.getSettings(),
        ]);
        setTiers(Array.isArray(tiersRes.data) ? tiersRes.data : []);
        if (settingsRes.data) {
          setIsOpen(settingsRes.data.isOpen ?? true);
          setRegistrationUrl(settingsRes.data.registrationUrl || "");
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // The overlapping 3-column "spotlight" layout only makes sense for
  // exactly 3 tiers with the highlighted one in the middle slot (the
  // convention admins are expected to follow via display order). Any
  // other count falls back to a plain centered wrap.
  const useSpotlightLayout = tiers.length === 3;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="w-full max-w-7xl mx-auto px-6 pt-38 pb-24 grow">
            <PageHeader
              className="mb-20 text-center"
              badge={isOpen ? "Join Our Community" : "Membership Closed"}
              title="Unlock Your Potential"
              subtitleClassName="max-w-3xl"
              subtitle={
                <>
                  Become a member and gain access to exclusive events,
                  workshops, and resources designed to boost your career in
                  computer engineering.
                </>
              }
            />

            {!loading && tiers.length > 0 && (
              <div className="w-full">
                {useSpotlightLayout ? (
                  <div className="group flex flex-col lg:flex-row justify-center items-center gap-16 lg:gap-8 lg:pt-12">
                    <div className="order-2 lg:order-1 w-full max-w-md lg:w-1/3 transition-all duration-500 ease-out lg:-mr-8 group-hover:lg:-translate-x-8">
                      <MembershipCard
                        {...tiers[0]}
                        isOpen={isOpen}
                        registrationUrl={registrationUrl}
                      />
                    </div>
                    <div className="order-1 lg:order-2 w-full max-w-md lg:w-1/3 z-10 transition-all duration-500 ease-out lg:scale-110 group-hover:lg:scale-105">
                      <MembershipCard
                        {...tiers[1]}
                        isOpen={isOpen}
                        registrationUrl={registrationUrl}
                      />
                    </div>
                    <div className="order-3 lg:order-3 w-full max-w-md lg:w-1/3 transition-all duration-500 ease-out lg:-ml-8 group-hover:lg:translate-x-8">
                      <MembershipCard
                        {...tiers[2]}
                        isOpen={isOpen}
                        registrationUrl={registrationUrl}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-8">
                    {tiers.map((tier) => (
                      <div key={tier._id} className="w-full max-w-md">
                        <MembershipCard
                          {...tier}
                          isOpen={isOpen}
                          registrationUrl={registrationUrl}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <InteractiveCta isOpen={isOpen} registrationUrl={registrationUrl} />
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
};

export default MembershipPage;
