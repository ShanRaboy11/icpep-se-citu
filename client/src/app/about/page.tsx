"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./sections/info";
import AdvisorsSection from "./sections/advisors";
import ProfileCard from "./components/profile-card";

// MOD: Import necessary hooks and components
import { FC, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ChevronRight } from "lucide-react";


// --- NEW COMPONENT FOR INDIVIDUAL CARD ANIMATION ---
// This component wraps one of your cards to correctly handle the animation hooks.
interface YearCardProps {
  i: number; // The index of the card (0, 1, 2...)
  termData: { term: string };
  scrollYProgress: MotionValue<number>;
  totalCards: number;
}

const YearCard: FC<YearCardProps> = ({ i, termData, scrollYProgress, totalCards }) => {
  // We calculate where this card's animation should start and end
  // based on the overall scroll progress of the parent section.
  const start = i / totalCards;
  const end = start + 1 / totalCards;

  // The first card (i=0) should have a fixed top position.
  // Each subsequent card will also have a fixed top position, but offset slightly.
  const staticTopOffset = i * 20; // Each card is 20px lower than the last.

  // For all cards except the first one, we animate their scale.
  // They start slightly smaller and scale up to 1 as you scroll into their section.
  const scale = useTransform(scrollYProgress, [start, end], [0.9, 1]);

  return (
    // Your original spacer div. NO CHANGES.
    <div className="h-[50vh]">
      {/* 
        This is your original 'sticky' div.
        - We make it a motion.div.
        - We apply a z-index so cards stack correctly.
        - We apply the calculated `top` offset for the stacking effect.
        - We apply the `scale` animation.
      */}
      <motion.div
        style={{
          scale: i === 0 ? 1 : scale, // The first card doesn't scale.
          top: `calc(5rem + ${staticTopOffset}px)`, // 5rem is from your 'top-20' class
          zIndex: totalCards - i,
        }}
        className="sticky h-[45vh]" // We keep h-[45vh] but remove top-20 as it's now in the style prop
      >
        {/* All your original card content and layout. NO CHANGES. */}
        <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary3 to-secondary1 shadow-2xl flex items-center justify-center overflow-hidden">
          <button
            className="absolute top-8 left-8 h-16 w-16 border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:backdrop-blur-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
            aria-label={`View officers for ${termData.term}`}
          >
            <ChevronRight size={32} />
          </button>
          <h3
            className="absolute -bottom-8 -right-12 font-rubik font-black text-[14rem] sm:text-[18rem] leading-none text-transparent select-none [-webkit-text-stroke:2px_rgba(255,255,255,0.2)]"
            aria-hidden="true"
          >
            {termData.term.slice(-4)}
          </h3>
        </div>
      </motion.div>
    </div>
  );
};


const officerHistory = [
  { term: "A.Y. 2023 - 2024" },
  { term: "A.Y. 2022 - 2023" },
  { term: "A.Y. 2021 - 2022" },
  { term: "A.Y. 2020 - 2021" },
];

const departmentFaculty = [
  {
    name: "Dr. Richard Roe",
    position: "Professor, AI & Machine Learning",
    imageUrl: "/gle.png",
  },
  // ... other faculty
];

const AboutPage: FC = () => {
  const pillText = "About Our Chapter";
  const title = "The ICpEP SE CIT-U Story";
  const subtitle =
    "Get to know our mission, values, and the dedicated individuals who bring ICPEP SE CIT-U Chapter to life and carry its legacy forward.";

  // MOD: Create a ref for the section that contains the cards.
  const containerRef = useRef<HTMLElement>(null);

  // MOD: Hook to track scroll progress ONLY within the referenced section.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <div className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem]">
            {/* ... your unchanged header content */}
            <div className="mb-20 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
                <div className="h-2 w-2 rounded-full bg-primary1"></div>
                <span className="font-raleway text-sm font-semibold text-primary1">{pillText}</span>
              </div>
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">{title}</h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">{subtitle}</p>
            </div>
            <InfoSection />
          </div>

          <AdvisorsSection />

          {/* MOD: Attach the ref here */}
          <section ref={containerRef} className="mt-40">
            <div className="w-full max-w-7xl mx-auto px-6 text-center">
              <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-4">Our Student Leaders</h2>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-16">A legacy of leadership upheld by the councils and committees whose commitment continues to inspire our chapter’s journey.</p>
            </div>

            <div className="relative w-full max-w-4xl mx-auto px-6">
              {/* MOD: Map over the history and render the new animated YearCard component */}
              {officerHistory.map((termData, i) => (
                <YearCard
                  key={termData.term}
                  i={i}
                  termData={termData}
                  scrollYProgress={scrollYProgress}
                  totalCards={officerHistory.length}
                />
              ))}
            </div>
          </section>

          <div className="w-full max-w-7xl mx-auto px-6 pb-24">
            {/* ... your unchanged faculty section */}
            <section className="mt-40">
              <h2 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 text-center mb-4">CPE Department Faculty</h2>
              <p className="font-raleway text-gray-600 text-center max-w-2xl mx-auto mb-16">The esteemed faculty members of the Computer Engineering department who mentor and inspire the next generation.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {departmentFaculty.map((faculty) => (
                  <ProfileCard key={faculty.name} {...faculty} />
                ))}
              </div>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;