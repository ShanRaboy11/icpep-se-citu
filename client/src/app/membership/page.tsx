// app/membership/page.tsx
"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import MembershipCard from "./components/membership-card";
import { User, Globe, Zap, ArrowRight } from "lucide-react";
import { useRef, type FC, type ReactNode, type MouseEvent } from "react";

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

// Interactive CTA where the effect only triggers on title hover
const InteractiveCta = () => {
  const textRef = useRef<HTMLHeadingElement | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLHeadingElement>) => {
    const textElement = textRef.current;
    if (!textElement) return;

    const { left, top } = textElement.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    textElement.style.setProperty("--mouse-x", `${x}px`);
    textElement.style.setProperty("--mouse-y", `${y}px`);
    textElement.style.setProperty("--opacity", "1");
  };

  const handleMouseLeave = () => {
    const textElement = textRef.current;
    if (textElement) {
      textElement.style.setProperty("--opacity", "0");
    }
  };

  return (
    // Increased top margin to mt-40
    <div className="relative text-center max-w-full mx-auto mt-40 py-16">
      <h2
        ref={textRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="font-rubik text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-primary3 relative cursor-default"
        style={
          {
            "--mouse-x": "50%",
            "--mouse-y": "50%",
            "--opacity": "0",
          } as React.CSSProperties
        }
      >
        <span
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: "var(--opacity)",
            background:
              "radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), #10b981 0%, #06b6d4 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Engineer Your Future!
        </span>
        Engineer Your Future!
      </h2>

      <p className="font-raleway text-gray-500 mt-8 mb-10 text-lg max-w-3xl mx-auto px-4">
        Ready to elevate your journey? Choose your plan and start enjoying the
        benefits today. The registration process is quick and easy.
      </p>

      <button
        onClick={() =>
          window.open("https://forms.gle/your-registration-form-link", "_blank")
        }
        className="bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold px-8 py-3 
                   rounded-full transition-all duration-300 transform hover:scale-105 
                   shadow-lg cursor-pointer"
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

          {/* --- Final CTA Section: Replaced with the new Interactive CTA --- */}
          <InteractiveCta />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MembershipPage;
