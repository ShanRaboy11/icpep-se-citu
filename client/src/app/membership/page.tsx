"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import MembershipCard from "./components/membership-card";
import InteractiveCta from "./components/cta";
import { User, Globe, Zap, ArrowRight } from "lucide-react";
import { type FC, type ReactNode } from "react";

interface MembershipTier {
  planLabel: string;
  title: string;
  price: string;
  description: string;
  benefits: string[];
  isHighlighted: boolean;
  accentColor: "primary" | "steel" | "sky";
  icon: ReactNode;
  buttonIcon: ReactNode;
}

const MembershipPage: FC = () => {
  const membershipTiers: MembershipTier[] = [
    {
      planLabel: "Student",
      title: "Student Chapter",
      price: "₱160",
      description: "For active students within the CIT-U chapter.",
      benefits: [
        "Access to exclusive local workshops & seminars.",
        "Discounts on chapter-led events and merchandise.",
        "Opportunity to hold leadership roles in the chapter.",
        "Priority registration for local competitions.",
      ],
      isHighlighted: false,
      accentColor: "steel",
      icon: <User size={24} />,
      buttonIcon: <ArrowRight size={20} />,
    },
    {
      planLabel: "All-Access",
      title: "All-Access Pass",
      price: "₱290",
      description: "The complete package for the dedicated student.",
      benefits: [
        "Includes ALL Student and National benefits.",
        "Significant savings over separate memberships.",
        "Highest priority for limited-slot events.",
        "Exclusive 'members-only' networking channels.",
      ],
      isHighlighted: true,
      accentColor: "primary",
      icon: <Zap size={24} />,
      buttonIcon: <Zap size={20} />,
    },
    {
      planLabel: "National",
      title: "National Membership",
      price: "₱150",
      description: "Connect with the nationwide ICPEP.SE community.",
      benefits: [
        "Official Certificate of Membership.",
        "Access to nationwide conventions and events.",
        "Digital subscription to the national journal.",
        "Broad networking opportunities.",
      ],
      isHighlighted: false,
      accentColor: "sky",
      icon: <Globe size={24} />,
      buttonIcon: <ArrowRight size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24 flex-grow">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                Join Our Community
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              Unlock Your Potential
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              Become a member and gain access to exclusive events, workshops,
              and resources designed to boost your career in computer
              engineering.
            </p>
          </div>

          <div className="w-full">
            <div className="group flex flex-col lg:flex-row justify-center items-center gap-16 lg:gap-8 lg:pt-12">
              {/* Student Card */}
              <div className="order-2 lg:order-1 w-full max-w-md lg:w-1/3 transition-all duration-500 ease-out lg:-mr-8 group-hover:lg:-translate-x-8">
                <MembershipCard {...membershipTiers[0]} />
              </div>

              {/* All-Access Card */}
              <div className="order-1 lg:order-2 w-full max-w-md lg:w-1/3 z-10 transition-all duration-500 ease-out lg:scale-110 group-hover:lg:scale-105">
                <MembershipCard {...membershipTiers[1]} />
              </div>

              {/* National Card */}
              <div className="order-3 lg:order-3 w-full max-w-md lg:w-1/3 transition-all duration-500 ease-out lg:-ml-8 group-hover:lg:translate-x-8">
                <MembershipCard {...membershipTiers[2]} />
              </div>
            </div>
          </div>

          <InteractiveCta />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MembershipPage;
