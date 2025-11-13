"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./sections/info";
import AdvisorsSection from "./sections/advisors";
import ProfileCard from "./components/profile-card";
import { FC, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ChevronRight } from "lucide-react";

// --- START: Student Leader Data ---
const officerHistory = [
  { term: "A.Y. 2023 - 2024" },
  { term: "A.Y. 2022 - 2023" },
  { term: "A.Y. 2021 - 2022" },
  { term: "A.Y. 2020 - 2021" },
];
// --- END: Student Leader Data ---

const departmentFaculty = [
  {
    name: "Dr. Richard Roe",
    position: "Professor, AI & Machine Learning",
    imageUrl: "/gle.png",
  },
  {
    name: "Engr. Susan Bones",
    position: "Instructor, Digital Logic Design",
    imageUrl: "/gle.png",
  },
  {
    name: "Prof. Peter Pan",
    position: "Lecturer, Embedded Systems",
    imageUrl: "/gle.png",
  },
  {
    name: "Dr. Wendy Darling",
    position: "Associate Professor, Networking",
    imageUrl: "/gle.png",
  },
];

// --- A dedicated component for each animating card to correctly use hooks ---
const AnimatedRotatingCard: FC<{
  index: number;
  totalCards: number;
  termData: { term: string };
  scrollYProgress: MotionValue<number>;
}> = ({ index, totalCards, termData, scrollYProgress }) => {
  const CARD_ROTATE_DEGREE = 8; // Controls the fanning angle, similar to --card-rotate in the jQuery
  
  // Calculate the initial fanned-out rotation for this card
  // The last card (index 3) will be at the top with 0 initial rotation
  const initialRotate = -(totalCards - 1 - index) * CARD_ROTATE_DEGREE;

  // As we scroll through the whole container (0 to 1), apply an "un-rotating" transform
  const unRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, (totalCards - 1) * CARD_ROTATE_DEGREE]
  );

  // The final rotation is the combination of the initial angle and the scroll-based "un-rotate"
  const rotate = useTransform(unRotate, (latestUnRotate) => initialRotate + latestUnRotate);
  
  // Make the card that is currently "un-rotating" slightly larger
  const scale = useTransform(scrollYProgress, 
    [(index / totalCards) - (0.5 / totalCards), (index / totalCards)], 
    [1, 1.05]
  );

  return (
    <motion.div
      className="absolute top-0 flex h-full w-full items-center justify-center"
      style={{
        rotate,
        scale,
        zIndex: index, // Ensure correct stacking order
        transformOrigin: "bottom center", // Pivot the rotation from the bottom
      }}
    >
      {/* --- THIS IS YOUR EXACT CARD JSX, UNCHANGED --- */}
      <div className="relative w-full max-w-4xl h-[45vh] rounded-3xl bg-gradient-to-br from-primary3 to-secondary1 shadow-2xl flex items-center justify-center overflow-hidden">
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
  );
};

// --- This component sets up the scroll container and maps the cards ---
const AnimatedStudentLeadersSection: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  const totalCards = officerHistory.length;
  // Calculate the required scroll height, similar to the jQuery logic
  const scrollHeight = totalCards * 400; // 400px scroll per card

  return (
    <section ref={scrollRef} className="relative" style={{ height: `${scrollHeight}px` }}>
      <div className="sticky top-20 h-[calc(100vh-5rem)]">
        {/* We reverse the array so that the latest year (2024) is rendered last and appears on top */}
        {[...officerHistory].reverse().map((termData, index) => (
          <AnimatedRotatingCard
            key={termData.term}
            index={index}
            totalCards={totalCards}
            termData={termData}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
};

const AboutPage: FC = () => {
  const pillText = "About Our Chapter";
  const title = "The ICpEP SE CIT-U Story";
  const subtitle =
    "Get to know our mission, values, and the dedicated individuals who bring ICPEP SE CIT-U Chapter to life and carry its legacy forward.";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <div className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem]">
            <div className="mb-20 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
                <div className="h-2 w-2 rounded-full bg-primary1"></div>
                <span className="font-raleway text-sm font-semibold text-primary1">
                  {pillText}
                </span>
              </div>
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                {title}
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
                {subtitle}
              </p>
            </div>
            <InfoSection />
          </div>

          <AdvisorsSection />

          <div className="w-full max-w-7xl mx-auto px-6 text-center mt-40">
            <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-4">
              Our Student Leaders
            </h2>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-16">
              A legacy of leadership upheld by the councils and committees
              whose commitment continues to inspire our chapter’s journey.
            </p>
          </div>

          <AnimatedStudentLeadersSection />

          <div className="w-full max-w-7xl mx-auto px-6 pb-24">
            <section className="mt-40">
              <h2 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 text-center mb-4">
                CPE Department Faculty
              </h2>
              <p className="font-raleway text-gray-600 text-center max-w-2xl mx-auto mb-16">
                The esteemed faculty members of the Computer Engineering
                department who mentor and inspire the next generation.
              </p>
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