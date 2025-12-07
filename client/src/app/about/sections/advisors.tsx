"use client";

import { FC, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AdvisorCard from "../components/advisor-card";

// Types
interface AdvisorItem {
  name: string;
  position: string;
  year: string;
  imageUrl: string;
}

const AdvisorsCarousel: FC<{ items: AdvisorItem[] }> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [xOffset, setXOffset] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const baseWidthRem = isMobile ? 16 : 20;

  useEffect(() => {
    const viewport = viewportRef.current;
    const activeItem = itemRefs.current[currentIndex];

    if (viewport && activeItem) {
      const viewportCenter = viewport.offsetWidth / 2;
      const activeItemCenter =
        activeItem.offsetLeft + activeItem.offsetWidth / 2;
      setXOffset(viewportCenter - activeItemCenter);
    }
  }, [currentIndex, isMobile]);

  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col items-center w-full overflow-visible">
      <div
        ref={viewportRef}
        className="w-full pt-12 pb-8 overflow-x-hidden overflow-y-visible"
      >
        <motion.div
          className="flex items-end gap-x-4"
          style={{
            paddingLeft: `calc(50% - ${baseWidthRem / 2}rem)`,
            paddingRight: `calc(50% - ${baseWidthRem / 2}rem)`,
          }}
          animate={{ x: xOffset }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          {items.map((item, index) => {
            const distance = Math.abs(currentIndex - index);
            const scale = distance === 0 ? 1 : distance === 1 ? 0.9 : 0.8;
            const marginOffset = (baseWidthRem * (1 - scale)) / 2;

            return (
              <motion.div
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="w-64 h-[22rem] min-w-[16rem] sm:w-80 sm:h-[28rem] sm:min-w-[20rem] origin-bottom overflow-visible shrink-0"
                animate={{ scale }}
                style={{
                  marginLeft: `-${marginOffset}rem`,
                  marginRight: `-${marginOffset}rem`,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                onClick={() => setCurrentIndex(index)}
              >
                <AdvisorCard {...item} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="relative z-10 mt-4 flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === items.length - 1}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

const advisorHistory: AdvisorItem[] = [
  {
    year: "2022 - Present",
    name: "Engr. Trixie Dolera",
    position: "CPE Department Head",
    imageUrl: "/gle.png",
  },
  {
    year: "2021 - Present",
    name: "Prof. Emily White",
    position: "ICPEP.SE Adviser",
    imageUrl: "/gle.png",
  },
  {
    year: "2020 - 2022",
    name: "Engr. John Smith",
    position: "CPE Department Head",
    imageUrl: "/gle.png",
  },
  {
    year: "2018 - 2020",
    name: "Dr. Alan Turing",
    position: "CPE Department Head",
    imageUrl: "/gle.png",
  },
  {
    year: "2019 - 2021",
    name: "Prof. Ada Lovelace",
    position: "ICPEP.SE Adviser",
    imageUrl: "/gle.png",
  },
  {
    year: "2017 - 2019",
    name: "Engr. Grace Hopper",
    position: "ICPEP.SE Adviser",
    imageUrl: "/gle.png",
  },
];

const AdvisorsSection: FC = () => {
  return (
    <section className="mt-40">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 text-center mb-4">
          Our Advisors
        </h2>
        <p className="font-raleway text-gray-600 text-center text-base sm:text-lg max-w-3xl mx-auto mb-8">
          A look back at the dedicated faculty whose steadfast support has
          strengthened our organization through the years.
        </p>
      </div>
      <div className="w-full">
        <AdvisorsCarousel items={advisorHistory} />
      </div>
    </section>
  );
};

export default AdvisorsSection;
