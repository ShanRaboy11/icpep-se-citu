// app/membership/page.tsx
"use client";
import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import MembershipCard from "./components/membership-card";
import type { FC } from "react";

// Define the type for a single membership tier object
interface MembershipTier {
  title: string;
  price: string;
  description: string;
  benefits: string[];
  isHighlighted: boolean;
}

const MembershipPage: FC = () => {
  // Type the array of membership tiers for type safety
  const membershipTiers: MembershipTier[] = [
    {
      title: "Student Chapter",
      price: "₱50",
      description: "Ideal for students active within the CIT-U chapter.",
      benefits: [
        "Access to exclusive local workshops and seminars.",
        "Discounts on all chapter-led events and merchandise.",
        "Opportunity to hold leadership roles within the chapter.",
        "Priority registration for local hackathons and competitions.",
      ],
      isHighlighted: false,
    },
    {
      title: "Combined National + Student",
      price: "₱300",
      description: "The complete package for the dedicated student.",
      benefits: [
        "Includes ALL benefits from Student and National tiers.",
        "Significant savings compared to separate memberships.",
        "Highest priority for limited-slot events and workshops.",
        "Exclusive access to 'members-only' networking channels.",
      ],
      isHighlighted: true,
    },
    {
      title: "National Membership",
      price: "₱280",
      description: "Connect with the nationwide ICPEP.SE community.",
      benefits: [
        "Official recognition and Certificate of Membership.",
        "Access to nationwide conventions and events.",
        "Digital subscription to the national ICPEP.SE journal.",
        "Networking opportunities with professionals and students nationwide.",
      ],
      isHighlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24 w-full flex-grow">
          {/* --- Page Title Section --- */}
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
              Become a member of ICPEP.SE CIT-U Chapter and gain access to
              exclusive events, workshops, networking opportunities, and
              resources designed to boost your career in computer engineering.
            </p>
          </div>

          {/* --- Membership Tiers Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 gap-x-8 items-stretch max-w-6xl mx-auto mb-24">
            {membershipTiers.map((tier, index) => (
              <MembershipCard key={index} {...tier} />
            ))}
          </div>

          {/* --- Final CTA Section --- */}
          <div className="text-center bg-gray-50 rounded-2xl p-10 max-w-4xl mx-auto">
            <h2 className="font-rubik text-3xl font-bold text-primary3 mb-4">
              Ready to Elevate Your Journey?
            </h2>
            <p className="font-raleway text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose your plan and start enjoying the benefits of being an
              ICPEP.SE member today. The registration process is quick and easy.
            </p>
            <button
              onClick={() => {
                // You can replace this with your actual registration form link
                window.open(
                  "https://forms.gle/your-registration-form-link",
                  "_blank"
                );
              }}
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
