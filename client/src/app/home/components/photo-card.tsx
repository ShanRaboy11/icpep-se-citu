"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardStackProps {
  imageUrls: string[];
}

export function CardStack({ imageUrls }: CardStackProps) {
  const [cards, setCards] = useState(imageUrls);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- Auto-cycle effect ---
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCards((prev) => {
        const newCards = [...prev];
        newCards.push(newCards.shift()!); // Move first image to end
        return newCards;
      });
      setTimeout(() => setIsAnimating(false), 300);
    }, 4000); // every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <AnimatePresence initial={false}>
        {cards.map((url, index) => {
          if (index > 2) return null; // Only top 3 cards visible

          return (
            <motion.div
              key={url}
              className="absolute h-full w-full overflow-hidden rounded-2xl border border-white/30 bg-secondary1 shadow-2xl"
              style={{ transformOrigin: "center center" }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{
                scale: 1 - index * 0.05,
                y: index * -15,
                rotate: index * 6 - 3,
                opacity: 1,
                zIndex: cards.length - index,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                transition: { duration: 0.2 },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="pointer-events-none h-full w-full object-cover"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
