"use client";

import { FC, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdvisorCard from "../components/advisor-card";
import advisorService from "@/app/services/advisor";
import { toTitleCase } from "@/app/officers/utils/format-name";

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
                className="w-64 h-88 min-w-64 sm:w-80 sm:h-112 sm:min-w-80 origin-bottom overflow-visible shrink-0"
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
          aria-label="Previous advisor"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === items.length - 1}
          aria-label="Next advisor"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

const AdvisorsSection: FC = () => {
  const [advisorHistory, setAdvisorHistory] = useState<AdvisorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await advisorService.getAdvisors();
        const data = Array.isArray(response.data) ? response.data : [];
        setAdvisorHistory(
          data.map((a: any) => ({
            name: toTitleCase(a.name),
            position: a.position,
            year: a.yearRange,
            imageUrl: a.image || "/content/gle.png",
          })),
        );
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisors();
  }, []);

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
      {!loading && advisorHistory.length > 0 && (
        <div className="w-full">
          <AdvisorsCarousel items={advisorHistory} />
        </div>
      )}
    </section>
  );
};

export default AdvisorsSection;
