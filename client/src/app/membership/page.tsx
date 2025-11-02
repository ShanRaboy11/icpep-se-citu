// app/membership/page.tsx
"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import MembershipCard from "./components/membership-card";
import { User, Globe, Zap, ArrowRight } from "lucide-react";
import type { FC, ReactNode } from 'react';

// Define the type for a single membership tier
interface MembershipTier {
  planLabel: string;
  title: string;
  price: string;
  description: string;
  benefits: string[];
  isHighlighted: boolean;
  accentColor: 'cyan' | 'green';
  icon: ReactNode;
  buttonIcon: ReactNode;
}

const MembershipPage: FC = () => {
  const membershipTiers: MembershipTier[] = [
    {
      planLabel: "Student",
      title: "Student Chapter",
      price: "₱50",
      description: "For active students within the CIT-U chapter.",
      benefits: [
        "Access to exclusive local workshops & seminars.",
        "Discounts on chapter-led events and merchandise.",
        "Opportunity to hold leadership roles in the chapter.",
        "Priority registration for local competitions.",
      ],
      isHighlighted: false,
      accentColor: "cyan",
      icon: <User size={24} />,
      buttonIcon: <ArrowRight size={20} />,
    },
    {
      planLabel: "All-Access",
      title: "All-Access Pass",
      price: "₱300",
      description: "The complete package for the dedicated student.",
      benefits: [
        "Includes ALL Student and National benefits.",
        "Significant savings over separate memberships.",
        "Highest priority for limited-slot events.",
        "Exclusive 'members-only' networking channels.",
      ],
      isHighlighted: true,
      accentColor: "green",
      icon: <Zap size={24} />,
      buttonIcon: <Zap size={20} />,
    },
    {
      planLabel: "National",
      title: "National Membership",
      price: "₱280",
      description: "Connect with the nationwide ICPEP.SE community.",
      benefits: [
        "Official Certificate of Membership.",
        "Access to nationwide conventions and events.",
        "Digital subscription to the national journal.",
        "Broad networking opportunities.",
      ],
      isHighlighted: false,
      accentColor: "cyan",
      icon: <Globe size={24} />,
      buttonIcon: <ArrowRight size={20} />,
    },
  ];

  return (
    // Structure now mirrors DevelopersPage exactly for a full-page grid background
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24 w-full flex-grow">
          {/* --- Page Title Section --- */}
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/20 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                Join Our Community
              </span>
            </div>
            {/* Text colors changed to be light for readability on dark grid */}
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-slate-100 leading-tight mb-4">
              Unlock Your Potential
            </h1>
            <p className="font-raleway text-slate-300 text-base sm:text-lg max-w-3xl mx-auto">
              Become a member and gain access to exclusive events, workshops, and resources designed to boost your career in computer engineering.
            </p>
          </div>

          {/* --- Membership Tiers Section --- */}
          <div className="w-full">
            <div className="group flex flex-col lg:flex-row justify-center items-center gap-8 lg:pt-12">
              <div className="w-full max-w-md lg:w-1/3 transition-all duration-500 ease-out lg:-mr-8 group-hover:lg:-translate-x-8">
                <MembershipCard {...membershipTiers[0]} />
              </div>
              <div className="w-full max-w-md lg:w-1/3 z-10 transition-all duration-500 ease-out lg:scale-110 group-hover:lg:scale-105">
                 <MembershipCard {...membershipTiers[1]} />
              </div>
              <div className="w-full max-w-md lg:w-1/3 transition-all duration-500 ease-out lg:-ml-8 group-hover:lg:translate-x-8">
                 <MembershipCard {...membershipTiers[2]} />
              </div>
            </div>
          </div>
          
          {/* --- Final CTA Section --- */}
          <div className="text-center bg-slate-900/50 backdrop-blur-xl rounded-2xl p-10 max-w-4xl mx-auto mt-24">
            <h2 className="font-rubik text-3xl font-bold text-slate-100 mb-4">Ready to Elevate Your Journey?</h2>
            <p className="font-raleway text-slate-300 mb-8 max-w-2xl mx-auto">
                Choose your plan and start enjoying the benefits today. The registration process is quick and easy.
            </p>
            <button
              onClick={() => window.open("https://forms.gle/your-registration-form-link", "_blank")}
              className="inline-block bg-primary1 text-white font-rubik font-bold text-lg px-8 py-4 rounded-lg
                         transition-all duration-300 ease-in-out
                         hover:bg-primary1/90 hover:shadow-lg transform hover:-translate-y-1"
            >
              Register Now
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MembershipPage;