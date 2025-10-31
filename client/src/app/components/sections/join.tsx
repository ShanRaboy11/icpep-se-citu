import { ArrowUpRight, Cpu, Rocket, Target, Network } from "lucide-react";
import { CardStack } from "../../home/components/photo-card";
import React, { useRef, useEffect } from "react";

const BenefitCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="relative group rounded-2xl p-4 sm:p-6 overflow-hidden">
    <div
      className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary1/40 via-secondary2/40 to-primary1/40 
                 bg-[length:200%_100%] blur-sm opacity-0 group-hover:opacity-50 
                 transition duration-1000 animate-shimmer"
    ></div>

    <div className="absolute inset-0 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-lg"></div>

    <div className="relative flex items-center gap-4 sm:gap-5 text-left">
      <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/10 text-primary1">
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="font-rubik text-base sm:text-xl font-bold text-secondary2">
          {title}
        </h3>
        <p className="mt-1 font-raleway text-sm text-gray-300">{description}</p>
      </div>

      <ArrowUpRight className="ml-auto h-6 w-6 flex-shrink-0 text-white/30" />
    </div>
  </div>
);

export function WhyJoinSection() {
  const benefits = [
    {
      icon: <Cpu size={24} />,
      title: "Level Up Your Skills",
      description: "Access exclusive workshops and trainings.",
    },
    {
      icon: <Rocket size={24} />,
      title: "Step into Leadership",
      description: "Lead projects and gain experience.",
    },
    {
      icon: <Target size={24} />,
      title: "Challenge Yourself",
      description: "Join competitions to test your capabilities.",
    },
    {
      icon: <Network size={24} />,
      title: "Be a COMPanion",
      description: "Grow with people who share your passion.",
    },
  ];

  const galleryImages = [
    "/whyicpep.png",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
  ];

  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const { left, top, width, height } =
        cardRef.current.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;

      const rotateY = (x / width) * 20;
      const rotateX = -(y / height) * 20;

      cardRef.current.style.setProperty("--card-rotate-x", `${rotateX}deg`);
      cardRef.current.style.setProperty("--card-rotate-y", `${rotateY}deg`);
    };

    const handleMouseLeave = () => {
      if (!cardRef.current) return;
      cardRef.current.style.setProperty("--card-rotate-x", "0deg");
      cardRef.current.style.setProperty("--card-rotate-y", "0deg");
    };

    const cardElement = cardRef.current;
    cardElement?.addEventListener("mousemove", handleMouseMove);
    cardElement?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cardElement?.removeEventListener("mousemove", handleMouseMove);
      cardElement?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="light-dark-background relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
      <div
        ref={cardRef}
        className="relative mx-auto w-full max-w-[98%] sm:max-w-[96%] lg:max-w-[93%] rounded-3xl 
           bg-gradient-to-br from-primary3 to-secondary1 
           px-10 sm:px-16 py-16 sm:py-20 shadow-2xl 
           transition-transform duration-300 ease-out 
           transform-style-preserve-3d -translate-y-[1.5rem]"
        style={{
          transform:
            "rotateX(var(--card-rotate-x, 0deg)) rotateY(var(--card-rotate-y, 0deg))",
        }}
      >
        <div className="mx-auto max-w-6xl w-full">
          <div className="w-full">
            <div className="mb-16 text-center">
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-secondary2 leading-tight mb-4">
                Why Join <br className="sm:hidden" /> ICpEP SE?
              </h1>
              <p className="font-raleway text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
                Unlock your potential in a community dedicated to growth and
                innovation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:gap-6 lg:grid-cols-2">
              <div className="aspect-square w-full lg:h-[475px] lg:aspect-auto">
                <CardStack imageUrls={galleryImages} />
              </div>

              <div className="flex flex-col gap-6">
                {benefits.map((benefit, index) => (
                  <BenefitCard key={index} {...benefit} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
