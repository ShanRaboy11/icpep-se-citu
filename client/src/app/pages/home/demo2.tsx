"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import Image from "next/image";
import Button from "@/app/components/button";
import Particles from "@/app/components/particles";

const partners = [
  { id: 1, logo: "/partners/google.png", tier: "platinum" },
  { id: 2, logo: "/partners/apple.png", tier: "platinum" },
  { id: 3, logo: "/partners/microsoft.png", tier: "gold" },
  { id: 4, logo: "/partners/intel.png", tier: "gold" },
  { id: 5, logo: "/partners/nvidia.png", tier: "silver" },
  { id: 6, logo: "/partners/tesla.png", tier: "silver" },
  { id: 7, logo: "/partners/meta.png", tier: "silver" },
];

const tierStyles = {
  platinum: {
    size: 130,
    border: "border-yellow-300",
    glow: "shadow-[0_0_40px_rgba(255,223,100,0.8)]",
  },
  gold: {
    size: 100,
    border: "border-blue-400",
    glow: "shadow-[0_0_30px_rgba(100,180,255,0.7)]",
  },
  silver: {
    size: 80,
    border: "border-green-400",
    glow: "shadow-[0_0_25px_rgba(100,255,150,0.6)]",
  },
};

export default function PartnersSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState(() =>
    partners.map((p) => ({
      id: p.id,
      x: Math.random() * 800,
      y: Math.random() * 400,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 1.2,
    }))
  );

  // physics-based floating & bouncing
  useAnimationFrame(() => {
    if (!containerRef.current) return;

    setPositions((prev) => {
      const rect = containerRef.current.getBoundingClientRect();
      const newPositions = [...prev];

      // collision + boundary logic
      for (let i = 0; i < newPositions.length; i++) {
        const circleA = newPositions[i];
        const tierA = tierStyles[partners[i].tier];
        const radiusA = tierA.size / 2;

        circleA.x += circleA.dx;
        circleA.y += circleA.dy;

        // bounce on edges
        if (circleA.x < 0 || circleA.x + radiusA * 2 > rect.width)
          circleA.dx *= -1;
        if (circleA.y < 0 || circleA.y + radiusA * 2 > rect.height)
          circleA.dy *= -1;

        // check collision with other circles
        for (let j = i + 1; j < newPositions.length; j++) {
          const circleB = newPositions[j];
          const tierB = tierStyles[partners[j].tier];
          const radiusB = tierB.size / 2;

          const dx = circleB.x - circleA.x;
          const dy = circleB.y - circleA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < radiusA + radiusB) {
            // simple bounce effect
            const angle = Math.atan2(dy, dx);
            const overlap = radiusA + radiusB - distance;

            circleA.x -= Math.cos(angle) * (overlap / 2);
            circleA.y -= Math.sin(angle) * (overlap / 2);
            circleB.x += Math.cos(angle) * (overlap / 2);
            circleB.y += Math.sin(angle) * (overlap / 2);

            // reverse direction
            [circleA.dx, circleB.dx] = [circleB.dx, circleA.dx];
            [circleA.dy, circleB.dy] = [circleB.dy, circleA.dy];
          }
        }
      }

      return newPositions;
    });
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#0146b3] py-24 flex flex-col items-center justify-center text-center"
    >
      {/* ✅ Particle background behind everything */}
      <div className="absolute inset-0 z-0">
        <Particles
          quantity={40}
          staticity={30}
          ease={80}
          color="#ffffff"
          refresh
        />
      </div>

      {/* Floating circles */}
      {positions.map((pos, i) => {
        const tier = tierStyles[partners[i].tier];
        return (
          <motion.div
            key={partners[i].id}
            className={`absolute rounded-full border-4 ${tier.border} ${tier.glow} bg-white/90 flex items-center justify-center z-10`}
            style={{
              width: `${tier.size}px`,
              height: `${tier.size}px`,
              left: pos.x,
              top: pos.y,
            }}
          >
            <Image
              src={partners[i].logo}
              alt={`Partner ${partners[i].id}`}
              width={tier.size * 0.5}
              height={tier.size * 0.5}
              className="object-contain"
            />
          </motion.div>
        );
      })}

      {/* Section text */}
      <div className="relative z-20 px-4 mt-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          OUR PARTNERS
        </h2>
        <p className="text-gray-200 mt-4 max-w-md mx-auto">
          Building meaningful collaborations that make an impact on students and
          the community.
        </p>
        <div className="mt-8">
          <Button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 text-sm md:text-base rounded-full">
            Explore Partnership
          </Button>
        </div>
      </div>
    </section>
  );
}
