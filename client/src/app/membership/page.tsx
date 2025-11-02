// app/membership/page.tsx
"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import MembershipCard from "./components/membership-card";
import { User, Globe, Zap, ArrowRight } from "lucide-react";
import { useRef, useEffect, type FC, type ReactNode } from "react"; // Added useRef and useEffect

// Define the type for a single membership tier
interface MembershipTier {
  planLabel: string;
  title: string;
  price: string;
  description: string;
  benefits: string[];
  isHighlighted: boolean;
  accentColor: "cyan" | "green";
  icon: ReactNode;
  buttonIcon: ReactNode;
}

// NEW: Self-contained component for the 3D Call-to-Action card
const CtaCard = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = cardElement.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;
      const rotateY = (x / width) * 15;
      const rotateX = -(y / height) * 15;

      cardElement.style.setProperty("--card-rotate-x", `${rotateX}deg`);
      cardElement.style.setProperty("--card-rotate-y", `${rotateY}deg`);
    };

    const handleMouseLeave = () => {
      cardElement.style.setProperty("--card-rotate-x", "0deg");
      cardElement.style.setProperty("--card-rotate-y", "0deg");
    };

    cardElement.addEventListener("mousemove", handleMouseMove);
    cardElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cardElement.removeEventListener("mousemove", handleMouseMove);
      cardElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative rounded-3xl bg-gradient-to-br from-primary3 to-secondary1 
                 p-10 max-w-4xl mx-auto mt-24 shadow-2xl 
                 transition-transform duration-300 ease-out transform-style-preserve-3d text-center"
      style={{
        transform:
          "rotateX(var(--card-rotate-x, 0deg)) rotateY(var(--card-rotate-y, 0deg))",
      }}
    >
      <h2 className="font-rubik text-3xl font-bold text-secondary2 mb-4">
        Ready to Elevate Your Journey?
      </h2>
      <p className="font-raleway text-gray-300 mb-8 max-w-2xl mx-auto">
        Choose your plan and start enjoying the benefits today. The registration
        process is quick and easy.
      </p>
      <button
        onClick={() =>
          window.open("https://forms.gle/your-registration-form-link", "_blank")
        }
        className="bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold px-8 py-3 
                   rounded-full transition-all duration-300 transform hover:scale-105 
                   shadow-lg cursor-pointer w-[220px] sm:w-auto"
      >
        Register Now
      </button>
    </div>
  );
};

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

          {/* --- Final CTA Section: Replaced with the new 3D Card --- */}
          <CtaCard />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MembershipPage;
